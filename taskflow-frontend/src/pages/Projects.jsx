import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WindowPanel from '../components/ui/WindowPanel';
import RetroButton from '../components/ui/RetroButton';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAll();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProject.title) {
      alert("Title is required.");
      return;
    }
    
    try {
      await projectService.create(newProject);
      setNewProject({ title: '', description: '' });
      setIsModalOpen(false);
      loadProjects();
    } catch {
      alert("Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId, title) => {
    const confirmed = window.confirm(`Delete project "${title}"? This will remove its tasks too.`);
    if (!confirmed) return;

    try {
      await projectService.delete(projectId);
      loadProjects();
    } catch {
      alert("Failed to delete project");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Active Projects</h2>
          <p className="text-sm">
            {user?.role === 'MEMBER'
              ? 'View the project workspaces you have been added to.'
              : "Manage your team's retro-brutalist workflows."}
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <RetroButton className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <span className="text-xl leading-none">+</span> Create Project
          </RetroButton>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <WindowPanel title="Create_Project.exe" type="main" className="w-full max-w-md">
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <label className="font-bold text-sm block mb-1">Project Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-retro-white brutal-border focus:outline-none focus:bg-white"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                  placeholder="e.g. ALPHA_REDESIGN"
                />
              </div>
              <div>
                <label className="font-bold text-sm block mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 bg-retro-white brutal-border focus:outline-none focus:bg-white min-h-[100px]"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  placeholder="System logs and tasks for..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  className="px-4 py-2 bg-white brutal-border font-bold brutal-btn-active"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewProject({ title: '', description: '' });
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-retro-pink brutal-border font-bold brutal-btn-active"
                  onClick={handleCreateProject}
                >
                  Execute
                </button>
              </div>
            </div>
          </WindowPanel>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <WindowPanel key={proj.id} title={`PROJ_${proj.id}.EXE`} type="card" className="h-full">
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2 leading-tight">{proj.title}</h3>
              <p className="text-sm mb-6 flex-1">{proj.description || "No description provided."}</p>
              
              <div className="flex justify-between items-center mt-auto border-t-2 border-retro-black pt-4">
                <div className="flex gap-2">
                   <div className="text-xs font-bold border-2 border-retro-black px-2 py-1 bg-white">{proj.memberIds?.length || 0} Members</div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => handleDeleteProject(proj.id, proj.title)}
                    className="px-3 py-1 bg-retro-red text-white brutal-border font-bold text-sm brutal-btn-active"
                  >
                    Delete
                  </button>
                )}
                <button 
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="px-3 py-1 bg-white brutal-border font-bold text-sm brutal-btn-active"
                >
                  Open Details
                </button>
              </div>
            </div>
          </WindowPanel>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center p-8 border-2 border-retro-black bg-white shadow-brutal">
            {user?.role === 'MEMBER' ? 'No assigned projects found.' : 'No active projects found.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
