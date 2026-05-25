import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Logo from '../components/Logo';

function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/api/auth/register', formData);
            toast.success('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error registering user');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-10 selection:bg-purple-500/30 relative overflow-hidden">
            <div className="absolute w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[150px] top-[-20%] left-[-10%]" />
            <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[150px] bottom-[-20%] right-[-10%]" />

            <div className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl z-10">
                <div className="flex flex-col items-center mb-6 gap-3">
                    <Logo size="lg" />
                    <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-violet-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                        RepoRover
                    </h1>
                </div>

                <h2 className="text-xl font-bold text-center mb-2">Join RepoRover</h2>
                <p className="text-zinc-500 text-center text-sm mb-6">Start analyzing code with AI power</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-zinc-500" />
                        <input type="text" placeholder="Username" required
                            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-600 transition"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-zinc-500" />
                        <input type="email" placeholder="Email Address" required
                            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-600 transition"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-zinc-500" />
                        <input type="password" placeholder="Password" required
                            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-violet-600 transition"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <button disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 font-bold rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition flex justify-center items-center gap-2 disabled:opacity-70">
                        {isLoading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight /></>}
                    </button>
                </form>

                <p className="text-center text-zinc-500 text-xs mt-8">
                    Already have an account? <Link to="/login" className="text-violet-400 hover:text-fuchsia-400 underline">Log in here</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
