import { Link } from 'react-router-dom';
import { Mail, Github, Instagram, Twitter, Command } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1 border-r border-white/5 pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-5 h-5 border border-white rotate-45 flex items-center justify-center transition-all duration-300 group-hover:neon-border">
                <div className="w-1.5 h-1.5 bg-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic text-glow">NEON<span className="font-thin opacity-50">_MODS</span></span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Pioneering the future of motorcycle customization. Engineering premium modifications for the next generation of riders.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white/80">Workshop</h4>
            <ul className="space-y-4">
              {['New Arrivals', 'Performance', 'Aerodynamics', 'Exhaust Systems', 'Smart Lighting'].map(item => (
                <li key={item}>
                  <Link to="/shop" className="text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all italic">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white/80">Support</h4>
            <ul className="space-y-4">
              {[
                { name: 'Shipping Policy', path: '/shipping' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'About Us', path: '/about' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all italic">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">NEOMOD INSIDER</h4>
            <p className="text-[10px] text-white/40 mb-6 font-bold uppercase tracking-widest">Join the elite performance network. Get early access to limited modification drops.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border border-white/10 px-4 py-2 text-[10px] focus:outline-none focus:border-white w-full transition-all font-mono" 
              />
              <button className="bg-white text-black px-4 py-2 text-[10px] font-black hover:bg-black hover:text-white border border-white transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-white/5 gap-4 text-[9px] uppercase tracking-[0.2em] font-bold text-white/20">
          <p>© 2026 NEXAMOD INDUSTRIES. BUILT FOR PERFORMANCE.</p>
          <div className="flex gap-8">
            <span>Session: 822.42-MOD</span>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Status Bar from design */}
      <div className="h-10 px-8 flex items-center justify-between bg-white text-black text-[9px] font-bold tracking-[0.2em] uppercase">
        <div className="flex gap-8">
          <span>Region: Global_North</span>
          <span className="opacity-50 italic">Uptime: 14h 22m</span>
          <span>Security_Level: 05</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 bg-black rounded-full animate-pulse"></span>
            <span>System Stable</span>
          </div>
          <div className="pl-4 border-l border-black/20 italic font-black">NEXA_MOD_CTRL_01</div>
        </div>
      </div>
    </footer>
  );
}
