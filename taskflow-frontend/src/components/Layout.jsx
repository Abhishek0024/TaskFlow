import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center border-b-2 border-retro-black pb-0 mb-6">
        <h1 className="text-2xl font-bold tracking-tighter font-mono uppercase pb-2">TaskFlow</h1>
        
        <nav className="flex items-end self-end translate-y-[2px]">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `px-6 py-2 border-2 border-retro-black border-b-0 font-bold ${isActive ? 'bg-retro-pink' : 'bg-retro-white'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => 
              `px-6 py-2 border-2 border-retro-black border-b-0 border-l-0 font-bold ${isActive ? 'bg-retro-pink' : 'bg-retro-white'}`
            }
          >
            Projects
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `px-6 py-2 border-2 border-retro-black border-b-0 border-l-0 font-bold ${isActive ? 'bg-retro-pink' : 'bg-retro-white'}`
            }
          >
            Profile
          </NavLink>
        </nav>

        <div className="flex gap-4 pb-2">
          <button className="p-1 hover:bg-retro-pink transition-colors cursor-pointer rounded">
            <Bell size={24} strokeWidth={2.5} />
          </button>
          <button className="p-1 hover:bg-retro-pink transition-colors cursor-pointer rounded">
            <Settings size={24} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
