import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../components/Layout';

export default function OrderSuccessPage() {
  return (
    <Layout>
      <div className="py-40 flex flex-col items-center justify-center text-center px-4">
        <motion.div
           initial={{ scale: 0, rotate: -180 }}
           animate={{ scale: 1, rotate: 0 }}
           className="w-24 h-24 border-2 border-white rotate-45 flex items-center justify-center mb-12 shadow-[0_0_30px_#fff]"
        >
          <CheckCircle size={40} className="-rotate-45" />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic mb-8">
          Mission <br/><span className="text-white/20">Authorized</span>
        </h1>
        
        <p className="max-w-md text-white/40 text-sm uppercase tracking-widest font-bold leading-loose mb-12">
          Your order has been transmitted to the manufacturing hub. A courier will be dispatched once the build is certified.
        </p>

        <div className="flex flex-wrap gap-6 justify-center">
          <Link 
            to="/" 
            className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Return to Hangar
          </Link>
          <Link 
            to="/orders" 
            className="px-10 py-5 border border-white/20 font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
          >
            Track Build <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
