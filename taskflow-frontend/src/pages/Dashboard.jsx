import { useEffect, useState } from 'react';
import WindowPanel from '../components/ui/WindowPanel';
import { activityService, projectService, taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatActivityTime = (createdAt) => {
  if (!createdAt) return 'Just now';

  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};

const activityColorByType = {
  PROJECT_CREATED: 'bg-retro-pink',
  MEMBER_ADDED: 'bg-retro-green',
  TASK_CREATED: 'bg-retro-yellow',
  TASK_STATUS_CHANGED: 'bg-blue-800',
};

const Dashboard = () => {
  const { user } = useAuth();
  const isMember = user?.role === 'MEMBER';
  const [stats, setStats] = useState({ totalTasks: 0, doneTasks: 0, pendingTasks: 0, projects: 0 });
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({ totalTasks: 0, doneTasks: 0, pendingTasks: 0, projects: 0 });
        const projects = await projectService.getAll();
        let tTasks = 0;
        let dTasks = 0;
        let pTasks = 0;

        for (const p of projects) {
          const tasks = await taskService.getByProject(p.id);
          const visibleTasks = isMember
            ? tasks.filter(t => t.assignedUserId === user?.userId)
            : tasks;

          tTasks += visibleTasks.length;
          visibleTasks.forEach(t => {
            if (t.status === 'DONE') dTasks++;
            else pTasks++;
          });
        }

        setStats({ totalTasks: tTasks, doneTasks: dTasks, pendingTasks: pTasks, projects: projects.length });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };
    fetchStats();
  }, [isMember, user?.role, user?.userId]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setActivityLogs([]);
        const logs = await activityService.getRecent();
        setActivityLogs(logs);
      } catch (error) {
        console.error("Failed to load activity logs", error);
      }
    };

    fetchActivity();
  }, [user?.role, user?.userId]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{isMember ? 'Personal Workspace' : 'System Overview'}</h2>
        <p className="text-sm">
          Welcome back, {user?.name || (isMember ? 'Member' : 'Admin')}.{' '}
          {isMember ? 'Your access is scoped to assigned project activity.' : 'Here is the current project health.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <WindowPanel title={isMember ? 'Assigned' : 'Total'} type="card" className="bg-retro-white">
          <div className="text-center py-4">
            <div className="text-5xl font-bold mb-2 text-retro-black">{stats.totalTasks}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">
              {isMember ? 'Tasks Assigned' : 'Tasks Registered'}
            </div>
          </div>
        </WindowPanel>
        <WindowPanel title="Done" type="card" className="bg-retro-pink bg-opacity-50">
          <div className="text-center py-4">
            <div className="text-5xl font-bold mb-2 text-retro-black">{stats.doneTasks}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">
              {isMember ? 'Completion Rate' : 'Success Rate'}: {stats.totalTasks ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0}%
            </div>
          </div>
        </WindowPanel>
        <WindowPanel title={isMember ? 'Open' : 'Pending'} type="card" className="bg-retro-white">
          <div className="text-center py-4">
            <div className="text-5xl font-bold mb-2 text-retro-black">{stats.pendingTasks}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-600 font-bold">
              {isMember ? 'Assigned To Do' : 'Active Sprints'}
            </div>
          </div>
        </WindowPanel>
        <WindowPanel title="Projects" type="card" className="bg-retro-pink bg-opacity-80">
          <div className="text-center py-4">
            <div className="text-5xl font-bold mb-2 text-retro-red">{stats.projects}</div>
            <div className="text-[10px] uppercase tracking-wider text-retro-red font-bold">
              {isMember ? 'Joined Workspaces' : 'Active Workspaces'}
            </div>
          </div>
        </WindowPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Log */}
        <div className="lg:col-span-2">
          <WindowPanel title={isMember ? 'Workspace_Activity.log' : 'Recent_Activity.log'} type="card" className="h-full">
            <div className="flex flex-col h-full justify-between">
              <div className="divide-y-2 divide-retro-black border-b-2 border-retro-black">
                {activityLogs.map(log => (
                  <div key={log.id} className="py-3 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded brutal-border shrink-0 ${activityColorByType[log.type] || 'bg-gray-800'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{log.message}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatActivityTime(log.createdAt)}
                        {log.projectTitle ? ` - ${log.projectTitle}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className="py-6 text-center text-sm font-bold text-gray-600">
                    No activity recorded yet.
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4 pt-4">
                <button className="px-6 py-2 bg-white brutal-border font-bold brutal-btn-active">
                  Load more logs...
                </button>
              </div>
            </div>
          </WindowPanel>
        </div>

        {/* Shortcuts */}
        <div>
          <WindowPanel title={isMember ? 'Member_Actions' : 'Shortcuts'} type="card" className="h-full">
            <div className="flex flex-col gap-4 mt-2">
              {!isMember && (
                <>
                  <div className="bg-retro-pink p-4 brutal-border brutal-btn-active cursor-pointer">
                    <h3 className="font-bold text-lg">Create Project</h3>
                    <p className="text-xs mt-1">New repository & team</p>
                  </div>
                  <div className="bg-white p-4 brutal-border brutal-btn-active cursor-pointer">
                    <h3 className="font-bold text-lg">Add Member</h3>
                    <p className="text-xs mt-1">Invite collaborators</p>
                  </div>
                </>
              )}
              {isMember && (
                <div className="bg-retro-yellow p-4 brutal-border">
                  <h3 className="font-bold text-lg">Member Access</h3>
                  <p className="text-xs mt-1">Admin controls are hidden for this role</p>
                </div>
              )}
              <div className="bg-white p-4 brutal-border brutal-btn-active cursor-pointer">
                <h3 className="font-bold text-lg">Export PDF</h3>
                <p className="text-xs mt-1">Quarterly summary</p>
              </div>
            </div>
          </WindowPanel>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
