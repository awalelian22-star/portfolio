import { motion } from 'motion/react';
import Layout from '@/src/components/Layout';
import { Shield, Zap, Cpu, Award } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      title: 'Precision Engineering',
      desc: 'Every component is designed with aerospace precision, ensuring a perfect fit and maximum performance.',
      icon: <Cpu className="w-8 h-8" />
    },
    {
      title: 'Future Aesthetics',
      desc: 'We don\'t just follow trends; we set them. Our designs are inspired by cyberpunk aesthetics and futuristic tech.',
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: 'Reliability',
      desc: 'Our modifications are tested in extreme conditions to ensure they stand the test of time and speed.',
      icon: <Shield className="w-8 h-8" />
    },
    {
      title: 'Elite Quality',
      desc: 'We use only the finest materials, from grade 5 titanium to precision-woven dry carbon fiber.',
      icon: <Award className="w-8 h-8" />
    }
  ];

  return (
    <Layout>
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-4 block"
          >
            EST. 2024 / ORIGIN STORY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8"
          >
            Pioneering the <br /> <span className="text-white/20">Next Frontier</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-white/60 text-lg leading-relaxed"
          >
            NEON_MODS was born from a singular vision: to bridge the gap between high-performance engineering and futuristic street aesthetics. We serve the next generation of riders who demand more than just transportation.
          </motion.p>
        </div>

        {/* Mission/Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold uppercase tracking-tight italic">Our Workshop</h2>
            <p className="text-white/50 leading-relaxed text-lg">
              Based in our state-of-the-art facility, our team of specialist engineers and designers work tirelessly to develop modifications that push the boundaries of what's possible on two wheels.
            </p>
            <p className="text-white/50 leading-relaxed text-lg">
              From custom exhaust modules with distinct acoustics to aerodynamic fairing kits that reduce drag at high speeds, our catalog represents the pinnacle of modern motorcycle customization.
            </p>
            <div className="pt-8 flex gap-8 border-t border-white/5">
              <div>
                <div className="text-3xl font-black italic">12K+</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-white/30">Riders Reached</div>
              </div>
              <div>
                <div className="text-3xl font-black italic">45+</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-white/30">Country Reach</div>
              </div>
            </div>
          </div>
          <div className="glass-card aspect-video relative overflow-hidden rounded-3xl border border-white/10 p-2">
            <img 
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200" 
              alt="Workshop" 
              className="w-full h-full object-cover rounded-2xl opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-32">
          <div className="text-center mb-16 space-y-4">
             <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold block">PHILOSOPHY</span>
             <h2 className="text-4xl font-bold uppercase tracking-tight italic">The Nexus of Performance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-10 rounded-3xl border border-white/5 hover:neon-border transition-all space-y-6"
              >
                <div className="text-white/40">{value.icon}</div>
                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-widest text-sm">{value.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed font-mono">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white p-16 md:p-24 rounded-[3rem] text-black text-center relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">Ready to upgrade <br /> your ride?</h2>
            <button className="px-12 py-5 bg-black text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-black/80 transition-all rounded-full">
              Explore the Inventory
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] select-none pointer-events-none">
            <h1 className="text-[250px] font-black leading-none italic uppercase">FUTURE</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
}
