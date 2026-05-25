import logo from '../assets/logo.png';

/**
 * Shared glowing logo component used across Login, Signup, and the Sidebar.
 * @param {string} size - 'sm' (sidebar) | 'lg' (auth pages). Defaults to 'lg'.
 */
export default function Logo({ size = 'lg' }) {
    const imgSize = size === 'sm' ? 'w-6 h-6' : 'w-20 h-20';
    const glowOuter = size === 'sm' ? 'blur-md bg-[#d06bff]/50' : 'blur-2xl bg-[#d06bff]/40 scale-150';
    const glowInner = size === 'sm' ? '' : 'blur-xl bg-[#e39fff]/60 scale-110 opacity-90';
    const shadow = size === 'sm'
        ? 'drop-shadow-[0_0_22px_rgba(255,190,255,1)] group-hover:drop-shadow-[0_0_35px_rgba(255,200,255,1)]'
        : 'drop-shadow-[0_0_45px_rgba(255,190,255,1)] hover:drop-shadow-[0_0_70px_rgba(255,200,255,1)] hover:brightness-[1.7] hover:scale-[1.1]';

    return (
        <div className="relative flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full opacity-90 ${glowOuter}`} />
            {glowInner && <div className={`absolute inset-0 rounded-full opacity-90 ${glowInner}`} />}
            <img
                src={logo}
                alt="RepoRover Logo"
                className={`relative ${imgSize} brightness-150 contrast-140 transition-all duration-500 ${shadow}`}
            />
        </div>
    );
}
