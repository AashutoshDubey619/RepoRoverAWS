import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogIn, Mail, Lock, User, Github, Zap, Search, Shield, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Logo from '../components/Logo';

export default function Landing() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                const res = await api.post('/api/auth/login', { email: formData.email, password: formData.password });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.result));
                toast.success('Login Successful! 🚀');
                navigate('/');
            } else {
                await api.post('/api/auth/register', formData);
                toast.success('Account Created! Please log in.');
                setIsLogin(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || (isLogin ? 'Login Failed' : 'Signup Failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#030303] text-white flex overflow-hidden selection:bg-purple-500/30 font-sans animate-in fade-in duration-1000">
            
            {/* Global Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />
                
                {/* Glowing Orbs */}
                <div className="absolute w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] -top-[20%] -left-[10%] animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] bottom-[-20%] right-[-10%] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
            </div>

            {/* LEFT PANEL - PRODUCT MARKETING */}
            <div className="hidden lg:flex lg:w-[55%] h-full relative z-10 flex-col justify-between p-10 xl:p-16 border-r border-white/5 bg-black/20 backdrop-blur-3xl">
                
                {/* Brand */}
                <div className="flex items-center gap-3 drop-shadow-2xl">
                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
                        <div className="relative">
                            <Logo size="md" />
                        </div>
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-white/90">RepoRover</span>
                </div>

                {/* Hero Copy */}
                <div className="max-w-2xl my-auto py-8">
                    <h1 className="text-5xl xl:text-[3.5rem] font-extrabold tracking-tight leading-[1.1] mb-5 drop-shadow-2xl">
                        Chat with your <br />
                        <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]">
                            entire codebase.
                        </span>
                    </h1>
                    <p className="text-lg xl:text-xl text-zinc-400 font-medium leading-relaxed max-w-lg mb-10 drop-shadow-md">
                        Understand repositories, debug faster, and navigate large codebases using AI.
                    </p>

                    {/* Features List */}
                    <div className="space-y-6">
                        <div className="group flex items-start gap-5 transition-transform hover:-translate-y-1 duration-300">
                            <div className="relative mt-1">
                                <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-md group-hover:bg-purple-500/40 transition duration-500" />
                                <div className="relative w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                    <Search className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-wide">Semantic Vector Search</h3>
                                <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">Instantly retrieve hyper-relevant code context using Pinecone and Gemini embeddings.</p>
                            </div>
                        </div>

                        <div className="group flex items-start gap-5 transition-transform hover:-translate-y-1 duration-300">
                            <div className="relative mt-1">
                                <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/40 transition duration-500" />
                                <div className="relative w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                    <Zap className="w-6 h-6 text-blue-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-wide">Instant File Mentions</h3>
                                <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">Use @mentions to physically lock the AI's semantic search space and eliminate hallucinations.</p>
                            </div>
                        </div>

                        <div className="group flex items-start gap-5 transition-transform hover:-translate-y-1 duration-300">
                            <div className="relative mt-1">
                                <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-md group-hover:bg-emerald-500/40 transition duration-500" />
                                <div className="relative w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                    <Shield className="w-6 h-6 text-emerald-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-wide">Enterprise-grade Security</h3>
                                <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">Secure data processing pipelines keeping your proprietary algorithms strictly confidential.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="font-mono text-xs text-zinc-600 font-semibold tracking-wider">
                    © 2026 REPOROVER INC.
                </div>
            </div>

            {/* RIGHT PANEL - AUTHENTICATION */}
            <div className="w-full lg:w-[45%] h-full flex items-center justify-center p-6 sm:p-12 relative z-10">
                
                <div className="w-full max-w-[420px] my-auto">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-10">
                        <Logo size="lg" />
                    </div>

                    {/* Premium Glass Card */}
                    <div className="relative group/auth">
                        {/* Interactive Border Glow */}
                        <div className="absolute -inset-[2px] bg-gradient-to-br from-purple-600/30 via-transparent to-blue-600/30 rounded-3xl blur-xl opacity-50 group-hover/auth:opacity-80 transition duration-1000" />
                        
                        <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                                    {isLogin ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p className="text-zinc-400 text-sm font-medium">
                                    {isLogin ? 'Login to access your workspace' : 'Join RepoRover and ship faster'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="relative group/input">
                                        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition duration-300 blur-sm" />
                                        <div className="relative flex items-center">
                                            <User className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors z-10" />
                                            <input 
                                                type="text" 
                                                placeholder="Username" 
                                                required 
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-[#121212] border border-white/5 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all relative z-0" 
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="relative group/input">
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition duration-300 blur-sm" />
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors z-10" />
                                        <input 
                                            type="email" 
                                            placeholder="name@company.com" 
                                            required 
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-[#121212] border border-white/5 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all relative z-0" 
                                            style={{ WebkitBoxShadow: '0 0 0 30px #121212 inset', WebkitTextFillColor: 'white' }}
                                        />
                                    </div>
                                </div>

                                <div className="relative group/input">
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within/input:opacity-100 transition duration-300 blur-sm" />
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors z-10" />
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            required 
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-[#121212] border border-white/5 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all relative z-0" 
                                            style={{ WebkitBoxShadow: '0 0 0 30px #121212 inset', WebkitTextFillColor: 'white' }}
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={isLoading}
                                    className="relative w-full py-4 mt-6 group/btn overflow-hidden rounded-xl font-bold transition-all disabled:opacity-70 active:scale-[0.98]"
                                >
                                    {/* Button Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] group-hover/btn:bg-right transition-all duration-500" />
                                    {/* Button Content */}
                                    <div className="relative flex items-center justify-center gap-2 text-white">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                                        {!isLoading && <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                                    </div>
                                </button>
                            </form>

                            {/* Optional OAuth Section */}
                            <div className="mt-8">
                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-zinc-800"></div>
                                    <span className="flex-shrink-0 mx-4 text-xs font-medium text-zinc-600 uppercase tracking-widest">Or continue with</span>
                                    <div className="flex-grow border-t border-zinc-800"></div>
                                </div>
                                <button 
                                    onClick={() => toast('GitHub OAuth coming soon!', { icon: '🚧' })}
                                    className="w-full mt-4 py-3 bg-[#121212] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-3"
                                >
                                    <Github className="w-5 h-5" />
                                    GitHub
                                </button>
                            </div>

                            <div className="mt-10 text-center text-sm font-medium text-zinc-500">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button 
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setFormData({ username: '', email: '', password: '' });
                                    }} 
                                    className="text-white hover:text-purple-400 underline underline-offset-4 transition-colors"
                                >
                                    {isLogin ? 'Sign up' : 'Log in'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
