import { useNavigate } from 'react-router-dom';
import WindowPanel from '../components/ui/WindowPanel';
import RetroInput from '../components/ui/RetroInput';
import { LogOut, Edit2, BarChart2 } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 h-full items-start w-full">
      {/* Left Sidebar */}
      <div className="flex flex-col gap-6 w-full lg:w-[320px] shrink-0">
        {/* System Activity */}
        <WindowPanel 
          title="SYSTEM ACTIVITY" 
          type="card" 
          headerClassName="bg-retro-black text-white tracking-widest text-xs py-1"
        >
          <div className="flex flex-col divide-y-2 divide-retro-black">
            <div className="py-3 pt-1">
              <p className="text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Just Now</p>
              <p className="text-sm font-mono">Created Project: <span className="underline">Alpha Redesign</span></p>
            </div>
            <div className="py-3">
              <p className="text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-wider">2 Hours Ago</p>
              <p className="text-sm font-mono">Completed Task: <span className="underline">API Integration</span></p>
            </div>
            <div className="py-3">
              <p className="text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Yesterday</p>
              <p className="text-sm font-mono">Updated Profile Image</p>
            </div>
            <div className="py-3">
              <p className="text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-wider">Oct 12, 1995</p>
              <p className="text-sm font-mono">Joined TaskFlow Network</p>
            </div>
          </div>
          <div className="mt-2 pt-3 border-t-2 border-retro-black text-center">
            <span className="text-xs font-bold underline cursor-pointer hover:text-retro-red tracking-wider">View Full History</span>
          </div>
        </WindowPanel>

        {/* Global Stats */}
        <div className="bg-retro-white brutal-border brutal-shadow flex flex-col">
          <div className="border-b-2 border-retro-black px-3 py-1 flex items-center gap-2 bg-retro-black text-white tracking-widest text-xs relative">
            <BarChart2 size={14} />
            <span className="font-bold">GLOBAL STATS</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-3">
            <div className="border-2 border-retro-black p-3 text-center bg-white flex flex-col justify-center items-center">
              <div className="text-2xl font-bold text-retro-red leading-none mb-1">142</div>
              <div className="text-[10px] font-bold uppercase tracking-wider">Tasks</div>
            </div>
            <div className="border-2 border-retro-black p-3 text-center bg-white flex flex-col justify-center items-center">
              <div className="text-2xl font-bold text-retro-yellow leading-none mb-1">12</div>
              <div className="text-[10px] font-bold uppercase tracking-wider">Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        <WindowPanel 
          title="User Settings" 
          type="main" 
          className="h-full bg-retro-white"
          headerClassName="bg-retro-black text-white tracking-wider"
        >
          {/* Header Profile Area */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center mb-6">
            <div className="relative shrink-0 self-center md:self-auto">
              <div className="w-24 h-24 border-2 border-retro-black brutal-shadow overflow-hidden relative bg-[#ecd1b4]">
                {/* Simulated two-tone background */}
                <div className="absolute top-0 left-0 w-full h-full bg-[#f1a499]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                {/* Fallback avatar */}
                <div className="w-full h-full relative z-10 flex items-end justify-center pb-2">
                  <div className="w-14 h-14 bg-gray-800 rounded-t-full"></div>
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-600 border-2 border-retro-black flex justify-center items-center cursor-pointer hover:bg-gray-500 z-20 brutal-btn-active">
                <Edit2 size={12} color="white" />
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-1">{user?.name || 'TaskFlow User'}</h2>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-retro-yellow border-2 border-retro-black px-1">{user?.role || 'MEMBER'}</span>
              </div>
              <span className="text-[11px] font-mono text-gray-700">Member since Oct 1995 • @chloe_t</span>
            </div>
          </div>

          {/* Account Information Box */}
          <div className="border-2 border-retro-black p-5 mb-6 bg-transparent">
            <h3 className="text-lg font-bold mb-5 border-b-4 border-retro-black inline-block pb-0.5 tracking-wide">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
               <RetroInput label="FULL NAME" id="fullName" value={user?.name || ''} onChange={()=>{}} className="uppercase text-xs" />
               <RetroInput label="USER ID" id="userId" value={user?.userId || ''} onChange={()=>{}} className="uppercase text-xs" />
               <RetroInput label="CURRENT PASSWORD" id="currentPass" type="password" value="********" onChange={()=>{}} className="uppercase text-xs" />
               <RetroInput label="NEW PASSWORD" id="newPass" type="password" placeholder="Leave blank to keep current" onChange={()=>{}} className="uppercase text-xs" />
            </div>
          </div>

          {/* System Preferences Box */}
          <div className="border-2 border-retro-black p-5 mb-6 bg-transparent">
            <h3 className="text-lg font-bold mb-5 border-b-4 border-retro-black inline-block pb-0.5 tracking-wide">System Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               
               {/* Setting Box 1 */}
               <div className="border-2 border-retro-black p-3 bg-white flex justify-between items-center h-[72px]">
                 <div className="flex flex-col justify-center">
                   <p className="font-bold text-xs uppercase mb-0.5">Email Notifications</p>
                   <p className="text-[10px] text-gray-500 font-mono">Weekly activity digests</p>
                 </div>
                 {/* Toggle ON (Pink) */}
                 <div className="w-10 h-5 border-2 border-retro-black bg-white flex items-center relative cursor-pointer">
                    <div className="w-1/2 h-full bg-retro-pink border-r-2 border-retro-black"></div>
                 </div>
               </div>

               {/* Setting Box 2 */}
               <div className="border-2 border-retro-black p-3 bg-white flex justify-between items-center h-[72px]">
                 <div className="flex flex-col justify-center">
                   <p className="font-bold text-xs uppercase mb-0.5">Dark Mode</p>
                   <p className="text-[10px] text-gray-500 font-mono">Currently: Inactive</p>
                 </div>
                 {/* Toggle OFF (White) */}
                 <div className="w-10 h-5 border-2 border-retro-black bg-white flex items-center relative cursor-pointer">
                    <div className="w-1/2 h-full absolute right-0 bg-white border-l-2 border-retro-black"></div>
                 </div>
               </div>

               {/* Setting Box 3 */}
               <div className="border-2 border-retro-black p-3 bg-white flex justify-between items-center h-[72px]">
                 <div className="flex flex-col justify-center">
                   <p className="font-bold text-xs uppercase mb-0.5">Sound Effects</p>
                   <p className="text-[10px] text-gray-500 font-mono">8-bit navigation cues</p>
                 </div>
                 {/* Toggle ON (Pink) */}
                 <div className="w-10 h-5 border-2 border-retro-black bg-white flex items-center relative cursor-pointer">
                    <div className="w-1/2 h-full bg-retro-pink border-r-2 border-retro-black"></div>
                 </div>
               </div>

               {/* Setting Box 4 */}
               <div className="border-2 border-retro-black p-3 bg-white flex justify-between items-center h-[72px]">
                 <div className="flex flex-col justify-center">
                   <p className="font-bold text-xs uppercase mb-0.5">Auto-Save</p>
                   <p className="text-[10px] text-gray-500 font-mono">Every 5 minutes</p>
                 </div>
                 {/* Toggle ON (Pink) */}
                 <div className="w-10 h-5 border-2 border-retro-black bg-white flex items-center relative cursor-pointer">
                    <div className="w-1/2 h-full bg-retro-pink border-r-2 border-retro-black"></div>
                 </div>
               </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t-2 border-retro-black pt-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-between mt-auto">
            <button className="px-6 py-2 bg-retro-black text-white font-bold border-2 border-retro-black brutal-shadow-sm brutal-btn-active uppercase tracking-wider text-xs w-full md:w-auto">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-retro-white text-retro-black font-bold border-2 border-retro-black brutal-shadow-sm brutal-btn-active flex items-center justify-center gap-2 uppercase tracking-wider text-xs w-full md:w-auto"
            >
               <LogOut size={14} /> Logout
            </button>
          </div>
        </WindowPanel>
      </div>

    </div>
  );
};

export default Profile;
