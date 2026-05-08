import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WindowPanel from '../components/ui/WindowPanel';
import RetroInput from '../components/ui/RetroInput';
import RetroButton from '../components/ui/RetroButton';
import { useAuth } from '../context/AuthContext';
import { Terminal } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login({ email, password });
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-retro-pink bg-opacity-40 flex items-center justify-center p-2 sm:p-4">
      <WindowPanel title="TaskFlow Login" type="main" className="w-full max-w-md">
        <div className="flex flex-col items-center mb-4 max-[720px]:mb-3">
          <div className="bg-retro-pink p-3 max-[720px]:p-2 brutal-border brutal-shadow-sm rotate-3 mb-3 max-[720px]:mb-2">
            <Terminal size={40} strokeWidth={2} className="max-[720px]:h-8 max-[720px]:w-8" />
          </div>
          <h2 className="font-mono font-bold text-lg">SYSTEM AUTH V1.0</h2>
          <p className="text-sm text-center">Please identify yourself to enter TaskFlow</p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-retro-red text-white text-xs font-bold text-center border-2 border-retro-black brutal-shadow-sm uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3 max-[720px]:gap-2">
          <RetroInput 
            label="Email Address" 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="user@taskflow.local" 
          />
          
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="font-bold text-sm">Password</label>
              <span className="text-xs font-bold cursor-pointer hover:underline">Forgot?</span>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-retro-white brutal-border focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="remember" className="w-5 h-5 brutal-border accent-retro-pink cursor-pointer" />
            <label htmlFor="remember" className="font-bold text-sm cursor-pointer">Remember this terminal</label>
          </div>

          <RetroButton type="submit" className="mt-2 text-lg py-2">Login</RetroButton>
        </form>

        <div className="mt-5 max-[720px]:mt-3 text-center text-sm font-bold">
          New agent? <Link to="/signup" className="hover:underline">Request access</Link>
        </div>
      </WindowPanel>
    </div>
  );
};

export default Login;
