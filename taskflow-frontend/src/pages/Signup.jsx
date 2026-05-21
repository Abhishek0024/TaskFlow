import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import WindowPanel from '../components/ui/WindowPanel';
import RetroInput from '../components/ui/RetroInput';
import RetroButton from '../components/ui/RetroButton';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');

    const result = await register(form);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-retro-pink bg-opacity-40 flex items-center justify-center p-2 sm:p-4 overflow-x-hidden">
      <WindowPanel title="TaskFlow Signup" type="main" className="w-full max-w-md">
        <div className="flex flex-col items-center mb-4 max-[720px]:mb-3">
          <div className="bg-retro-yellow p-3 max-[720px]:p-2 brutal-border brutal-shadow-sm -rotate-3 mb-3 max-[720px]:mb-2">
            <UserPlus size={40} strokeWidth={2} className="max-[720px]:h-8 max-[720px]:w-8" />
          </div>
          <h2 className="font-mono font-bold text-lg">ACCESS REQUEST V1.0</h2>
          <p className="text-sm text-center">Create your TaskFlow identity and clearance level</p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-retro-red text-white text-xs font-bold text-center border-2 border-retro-black brutal-shadow-sm uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-3 max-[720px]:gap-2">
          <RetroInput
            label="Agent Name"
            id="name"
            value={form.name}
            onChange={updateField('name')}
            placeholder="Ada Lovelace"
          />

          <RetroInput
            label="Email Address"
            id="email"
            type="email"
            value={form.email}
            onChange={updateField('email')}
            placeholder="user@taskflow.local"
          />

          <RetroInput
            label="Password"
            id="password"
            type="password"
            value={form.password}
            onChange={updateField('password')}
            placeholder="Enter access phrase"
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="font-bold text-sm">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={updateField('role')}
              className="px-3 py-2 bg-retro-white brutal-border focus:outline-none focus:bg-white font-bold"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <RetroButton type="submit" className="mt-2 text-lg py-2">Create Account</RetroButton>
        </form>

        <div className="mt-5 max-[720px]:mt-3 text-center text-sm font-bold">
          Already cleared?{' '}
          <Link to="/login" className="hover:underline">
            Return to login
          </Link>
        </div>
      </WindowPanel>
    </div>
  );
};

export default Signup;
