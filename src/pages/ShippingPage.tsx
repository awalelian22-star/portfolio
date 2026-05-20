import { motion } from 'motion/react';
import Layout from '@/src/components/Layout';
import { Truck, Globe, ShieldCheck, Clock } from 'lucide-react';

export default function ShippingPage() {
  const policies = [
    {
      title: 'Global Distribution',
      desc: 'We ship to over 45 countries worldwide. Our logistics partners specialize in handling sensitive high-performance components.',
      icon: <Globe className="w-12 h-12" />
    },
    {
      title: 'Fast Processing',
      desc: 'Orders for in-stock items are processed within 24-48 hours. Custom titanium builds may require additional lead time.',
      icon: <Clock className="w-12 h-12" />
    },
    {
      title: 'Secure Handling',
      desc: 'Every module is packed in vacuum-sealed anti-static shielding and reinforced structural crates to prevent transit damage.',
      icon: <ShieldCheck className="w-12 h-12" />
    }
  ];

  return (
    <Layout>
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-4 block"
          >
            LOGISTICS / DISTRIBUTION
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8"
          >
            Shipping <span className="text-white/20">Protocols</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-white/60 text-lg leading-relaxed"
          >
            Our shipping infrastructure ensures that your performance modifications arrive in factory-perfect condition, no matter where you are in the world.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {policies.map((policy, i) => (
            <div key={i} className="glass-card p-12 rounded-3xl border border-white/5 space-y-8">
              <div className="text-white/40">{policy.icon}</div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase italic tracking-tight">{policy.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-mono italic">{policy.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-12 rounded-[2.5rem] border border-white/10 overflow-hidden relative">
          <div className="relative z-10 space-y-12">
            <h2 className="text-3xl font-bold uppercase italic">Shipping Zones & Estimates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               {[
                 { name: 'Priority Alpha', region: 'North America / EU', time: '3-5 Business Days', price: '$45.00' },
                 { name: 'Priority Beta', region: 'Asia Pacific', time: '5-7 Business Days', price: '$65.00' },
                 { name: 'Standard Gamma', region: 'Rest of World', time: '10-14 Business Days', price: '$85.00' },
                 { name: 'White Glove', region: 'Full Bike Assemblies', time: 'Subject to build', price: 'Custom Quote' },
               ].map((zone, i) => (
                 <div key={i} className="space-y-2 border-l border-white/10 pl-6">
                   <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{zone.name}</div>
                   <div className="text-lg font-bold uppercase">{zone.region}</div>
                   <div className="text-xs text-white/40 font-mono italic">{zone.time}</div>
                   <div className="text-sm font-black text-white italic pt-2">{zone.price}</div>
                 </div>
               ))}
            </div>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 opacity-[0.05] pointer-events-none">
            <Truck size={400} strokeWidth={1} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
