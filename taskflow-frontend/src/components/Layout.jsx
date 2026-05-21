import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center border-b-2 border-retro-black pb-0 mb-6 gap-4 md:gap-0 pt-4 md:pt-0">
        <div className="flex justify-between items-center w-full md:w-auto px-2 md:px-0">
          <h1 className="text-2xl font-bold tracking-tighter font-mono uppercase">TaskFlow</h1>
          <div className="flex gap-2 md:hidden">
            <button className="p-1 hover:bg-retro-pink transition-colors cursor-pointer rounded">
              <Bell size={24} strokeWidth={2.5} />
            </button>
            <button className="p-1 hover:bg-retro-pink transition-colors cursor-pointer rounded">
              <Settings size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        
        <nav className="flex items-end self-center md:self-end translate-y-[2px] w-full md:w-auto overflow-x-auto hide-scrollbar">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `px-4 md:px-6 py-2 border-2 border-retro-black border-b-0 font-bold flex-1 text-center md:flex-none whitespace-nowrap ${isActive ? 'bg-retro-pink' : 'bg-retro-white'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => 
              `px-4 md:px-6 py-2 border-2 border-retro-black border-b-0 border-l-0 md:border-l-0 border-l-2 font-bold flex-1 text-center md:flex-none whitespace-nowrap ${isActive ? 'bg-retro-pink' : 'bg-retro-white'}`
            }
          >
            Projects
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `px-4 md:px-6 py-2 border-2 border-retro-black border-b-0 border-l-0 md:border-l-0 border-l-2 font-bold flex-1 text-center md:flex-none whitespace-nowrap ${isActive ? 'bg-retro-pink' : 'bg-retro-white'}`
            }
          >
            Profile
          </NavLink>
        </nav>

        <div className="hidden md:flex gap-4 pb-2">
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
