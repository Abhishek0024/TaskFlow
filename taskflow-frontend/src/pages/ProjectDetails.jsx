import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import WindowPanel from '../components/ui/WindowPanel';
import DroppableColumn from '../components/ui/DroppableColumn';
import DraggableTask from '../components/ui/DraggableTask';
import { projectService, taskService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const loadTasks = async () => {
    try {
      const data = await taskService.getByProject(id);
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projects = await projectService.getAll();
        setProject(projects.find(p => p.id.toString() === id) || null);
      } catch (error) {
        console.error("Failed to load project", error);
      }
    };
    const fetchTasks = async () => {
      try {
        const data = await taskService.getByProject(id);
        setTasks(data);
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };

    fetchProject();
    fetchTasks();
  }, [id]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isAdmin) return;

      try {
        const data = await userService.getMembers();
        setMembers(data);
      } catch (error) {
        console.error("Failed to load members", error);
      }
    };

    fetchMembers();
  }, [isAdmin]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    
    const taskId = active.id;
    const newStatus = over.id; // The column id is the status
    
    // Optimistic UI update
    setTasks(tasks.map(t => t.id.toString() === taskId ? { ...t, status: newStatus } : t));
    
    try {
      await taskService.updateStatus(taskId, newStatus);
    } catch {
      alert("Failed to update task status.");
      loadTasks(); // revert on failure
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title) {
      alert("Title is required.");
      return;
    }
    
    try {
      await taskService.create({ ...newTask, projectId: id, status: 'TODO' });
      setNewTask({ title: '', description: '' });
      setIsModalOpen(false);
      loadTasks();
    } catch {
      alert("Failed to create task");
    }
  };

  const handleAddMember = async () => {
    if (!selectedMemberId) {
      alert("Select a member first.");
      return;
    }

    try {
      await projectService.addMember(id, selectedMemberId);
      setSelectedMemberId('');
      setIsMemberModalOpen(false);
      const projects = await projectService.getAll();
      setProject(projects.find(p => p.id.toString() === id) || null);
    } catch {
      alert("Failed to add member");
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');
  const availableMembers = members.filter(member => !project?.memberIds?.includes(member.id));
  const teamMembers = [
    { name: user?.name || 'Project Admin', role: 'Admin' },
    ...(project?.memberNames || [])
      .filter(memberName => memberName !== user?.name)
      .map(memberName => ({ name: memberName, role: 'Member' })),
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex gap-4 h-full">
        {/* Left Sidebar - Team Members */}
        <WindowPanel title="TEAM MEMBERS" type="card" className="w-64 shrink-0 bg-retro-white flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2 pb-4 flex flex-col gap-3">
            {teamMembers.map((member, index) => (
              <div key={`${member.name}-${index}`} className="flex items-center gap-3 p-2 border-2 border-retro-black bg-white">
                <div className="w-8 h-8 bg-pink-300 brutal-border shrink-0"></div>
                <div>
                  <p className="text-sm font-bold leading-none">{member.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="w-full mt-auto py-2 bg-retro-white border-2 border-retro-black font-bold brutal-btn-active flex justify-center items-center gap-2"
            >
               + ADD MEMBER
            </button>
          )}
        </WindowPanel>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Project Header */}
          <div className="bg-retro-pink border-2 border-retro-black p-4 mb-4 flex justify-between items-center brutal-shadow-sm">
            <div>
              <h2 className="text-2xl font-bold mb-1">Project Workspace</h2>
              <p className="text-sm">
                {isAdmin ? `Manage tasks for project ${id}.` : `Work the board for your assigned project ${id}.`}
              </p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-white border-2 border-retro-black px-4 py-2 font-bold flex items-center gap-2 brutal-btn-active">
              <span>+</span> NEW TASK
            </button>
          </div>

          {isModalOpen && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <WindowPanel title="New_Task.exe" type="main" className="w-full max-w-md">
                <div className="flex flex-col gap-4 mt-2">
                  <div>
                    <label className="font-bold text-sm block mb-1">Task Title</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-retro-white brutal-border focus:outline-none focus:bg-white"
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      placeholder="e.g. Fix button active states"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-sm block mb-1">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 bg-retro-white brutal-border focus:outline-none focus:bg-white min-h-[100px]"
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Detailed requirements..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      className="px-4 py-2 bg-white brutal-border font-bold brutal-btn-active"
                      onClick={() => {
                        setIsModalOpen(false);
                        setNewTask({ title: '', description: '' });
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="px-4 py-2 bg-retro-pink brutal-border font-bold brutal-btn-active"
                      onClick={handleCreateTask}
                    >
                      Execute
                    </button>
                  </div>
                </div>
              </WindowPanel>
            </div>
          )}

          {isMemberModalOpen && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <WindowPanel title="Add_Member.exe" type="main" className="w-full max-w-md">
                <div className="flex flex-col gap-4 mt-2">
                  <div>
                    <label htmlFor="memberId" className="font-bold text-sm block mb-1">Project Member</label>
                    <select
                      id="memberId"
                      value={selectedMemberId}
                      onChange={e => setSelectedMemberId(e.target.value)}
                      className="w-full px-3 py-2 bg-retro-white brutal-border focus:outline-none focus:bg-white font-bold"
                    >
                      <option value="">Select member</option>
                      {availableMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {availableMembers.length === 0 && (
                    <div className="p-3 bg-white brutal-border text-sm font-bold">
                      All members are already assigned to this project.
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="px-4 py-2 bg-white brutal-border font-bold brutal-btn-active"
                      onClick={() => {
                        setIsMemberModalOpen(false);
                        setSelectedMemberId('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-retro-pink brutal-border font-bold brutal-btn-active disabled:opacity-50"
                      onClick={handleAddMember}
                      disabled={availableMembers.length === 0}
                    >
                      Add Member
                    </button>
                  </div>
                </div>
              </WindowPanel>
            </div>
          )}

          {/* Kanban Board */}
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
              
              <DroppableColumn id="TODO" title="TODO" titleClassName="bg-retro-black">
                {todoTasks.map(task => <DraggableTask key={task.id} task={task} />)}
              </DroppableColumn>

              <DroppableColumn id="IN_PROGRESS" title="IN PROGRESS" titleClassName="bg-gray-500">
                {inProgressTasks.map(task => <DraggableTask key={task.id} task={task} />)}
              </DroppableColumn>

              <DroppableColumn id="DONE" title="DONE" titleClassName="bg-gray-400">
                {doneTasks.map(task => <DraggableTask key={task.id} task={task} />)}
              </DroppableColumn>
              
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
