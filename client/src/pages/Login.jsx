import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Logo from '../components/Logo';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.result));
            toast.success('Login Successful! 🚀');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login Failed');
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

                <h2 className="text-xl font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-zinc-500 text-center text-sm mb-6">Login to access your RepoRover workspace</p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        {isLoading ? <Loader2 className="animate-spin" /> : <>Sign In <LogIn /></>}
                    </button>
                </form>

                <p className="text-center text-zinc-500 text-xs mt-8">
                    New to RepoRover? <Link to="/signup" className="text-violet-400 hover:text-fuchsia-400 underline">Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
