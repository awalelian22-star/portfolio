import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Package, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, profile, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const path = 'orders';
      try {
        const q = query(collection(db, path), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <Layout>
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold">
              RIDER_PROFILE / {user.uid.slice(0, 8)}
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
              {profile?.displayName || 'OPERATOR'} <br/><span className="text-white/20">ACCESS</span>
            </h1>
          </div>
          <div className="glass-card p-10 rounded-sm border-white/5 space-y-4 min-w-[300px]">
             <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Registered Email</div>
             <div className="text-sm font-mono italic">{user.email}</div>
             <button onClick={() => logout()} className="text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 mt-4 underline">Logout Session</button>
          </div>
        </div>

        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Order_History</h2>
            <div className="flex-grow h-px bg-white/10" />
          </div>

          {loading ? (
             <div className="py-20 text-center text-[10px] font-bold uppercase tracking-widest animate-pulse">Scanning Archive...</div>
          ) : orders.length === 0 ? (
             <div className="py-20 text-center glass-card border-dashed border-white/10 rounded-sm">
                <p className="text-white/20 uppercase tracking-widest font-bold mb-8">No order records found in database.</p>
                <Link to="/shop" className="px-10 py-4 bg-white text-black font-black text-xs uppercase tracking-widest border border-white hover:bg-black hover:text-white transition-all">Initialize Build</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
               {orders.map((order) => (
                 <motion.div 
                   key={order.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="glass-card p-10 rounded-sm border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:border-white/20 transition-all"
                 >
                    <div className="flex items-center gap-8">
                       <div className="w-12 h-12 border border-white rotate-45 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                          <Package size={20} className="-rotate-45" />
                       </div>
                       <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">TX_ID: {order.id.slice(0, 12).toUpperCase()}</div>
                          <div className="text-lg font-bold uppercase tracking-widest italic">{order.items.length} Modules Connected</div>
                       </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-12">
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">Credits</div>
                          <div className="text-sm font-mono italic">${order.total}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">Status</div>
                          <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full shadow-[0_0_5px_#fff]", 
                                  order.status === 'pending' ? 'bg-orange-500 shadow-orange-500/50' : 
                                  order.status === 'shipped' ? 'bg-blue-500 shadow-blue-500/50' :
                                  order.status === 'completed' ? 'bg-green-500 shadow-green-500/50' :
                                  'bg-red-500 shadow-red-500/50'
                                )} />
                                {order.status}
                             </div>
                             <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-1000",
                                    order.status === 'pending' ? 'w-1/4 bg-orange-500' :
                                    order.status === 'shipped' ? 'w-3/4 bg-blue-500' :
                                    order.status === 'completed' ? 'w-full bg-green-500' : 'w-0 bg-red-500'
                                  )}
                                />
                             </div>
                          </div>
                       </div>
                       <button className="p-4 border border-white/10 rounded-full hover:border-white transition-all">
                          <ArrowRight size={18} />
                       </button>
                    </div>
                 </motion.div>
               ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
