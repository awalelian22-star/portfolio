import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Hero3D from '@/src/components/Hero3D';
import ProductCard from '@/src/components/ProductCard';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/src/data/products';
import { ArrowRight, Zap, Shield, Cpu, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/src/components/Layout';
import { getStoredProducts } from '../lib/products-store';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const stored = await getStoredProducts();
        setProducts(stored);
      } catch (err) {
        console.error('Failed to load products for homepage:', err);
        setProducts(SAMPLE_PRODUCTS);
      }
    };
    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <Layout>
      <div className="relative">
        {/* Hero Section */}
        <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
          <Hero3D />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold mb-8"
          >
            NEW ARRIVAL / TITANIUM SERIES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-7xl md:text-[120px] font-black tracking-tighter uppercase italic leading-[0.8] mb-8"
          >
            CYBER <br /> 
            <span className="text-white/20">MODS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-md mx-auto text-white/60 text-sm font-light leading-relaxed mb-12"
          >
            Pure race aesthetics and unmatched acoustics. Engineered with aerospace materials for the next generation of riders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link 
              to="/shop" 
              className="px-12 py-4 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Add to Build
            </Link>
            <Link 
              to="/about" 
              className="px-8 py-4 border border-white/20 font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
            >
              Philosophy
            </Link>
          </motion.div>
        </div>

        {/* Floating Text background like design */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none z-0">
          <h1 className="text-[350px] font-black leading-none italic uppercase">CYBER</h1>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white rounded-full" />
        </motion.div>
      </section>

      {/* Featured Statistics */}
      <section className="py-20 border-y border-white/5 bg-black/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Power Gain', value: '+15%', icon: <Zap size={20} /> },
            { label: 'Weight Reduction', value: '-8.5KG', icon: <Cpu size={20} /> },
            { label: 'Global Distribution', value: '45+', icon: <Shield size={20} /> },
            { label: 'Happy Riders', value: '12K+', icon: <Zap size={20} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <div className="flex justify-center text-white/40 mb-4">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold font-mono">{stat.value}</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-4 block">BROWSE SYSTEMS</span>
              <h2 className="text-4xl font-bold uppercase">Modification Categories</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-2">
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.slice(0, 6).map((cat, i) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="group p-8 glass-card rounded-2xl hover:neon-border transition-all text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <div className="w-4 h-4 bg-white/40 rounded-sm rotate-45 group-hover:bg-white transition-colors" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-40 group-hover:opacity-100">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="text-center mb-20 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold block">ELITE PERFORMANCE</span>
              <h2 className="text-5xl font-bold uppercase">Featured Collections</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             {featuredProducts.map(product => (
               <ProductCard key={product.id} product={product} />
             ))}
           </div>
           
           <div className="mt-20 text-center">
             <Link 
               to="/shop" 
               className="inline-flex items-center gap-3 px-12 py-5 rounded-full border border-white/20 hover:border-white transition-all font-bold uppercase tracking-widest text-xs"
             >
               View Full Inventory
               <ChevronRight size={18} />
             </Link>
           </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 order-2 lg:order-1">
             <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold block">CORE TECHNOLOGY</span>
                <h2 className="text-5xl md:text-6xl font-bold uppercase leading-tight">
                  AEROSPACE GRADE <br /> ENGINEERING
                </h2>
             </div>
             
             <div className="space-y-8 max-w-xl">
               {[
                 { title: 'T-X TITANIUM', desc: 'Sourced from specialist aerospace suppliers, our titanium components offer the highest strength-to-weight ratio in the industry.' },
                 { title: 'NEXA-CORE 3.0', desc: 'Smart integration of IoT sensors within fairing structures for real-time aerodynamic analysis and rider feedback.' },
                 { title: 'CARBON MATRIX', desc: 'Precision-woven dry carbon fiber using proprietary resin formulas for maximum rigidity and heat dissipation.' },
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 group">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold group-hover:neon-border transition-all">0{i+1}</div>
                   <div className="space-y-2">
                     <h4 className="font-bold uppercase tracking-widest">{item.title}</h4>
                     <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="order-1 lg:order-2 glass-card rounded-3xl p-4 overflow-hidden relative group aspect-square lg:aspect-auto h-full min-h-[500px]">
             <img 
               src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200" 
               className="w-full h-full object-cover rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
             <div className="absolute bottom-12 left-12 right-12">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-[1px] bg-white/40" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">TECH PREVIEW</span>
               </div>
               <h3 className="text-3xl font-bold uppercase">TITAN SERIES <br /> EXHAUST MODULES</h3>
             </div>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  );
}
