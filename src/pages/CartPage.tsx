import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, totalPrice } = useCart();

  return (
    <Layout>
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-20 space-y-6">
          <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold">
            CART_INDEX / BUILD_QUEUE
          </div>
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.8]">Build <br/><span className="text-white/20">Queue</span></h1>
        </div>

        {items.length === 0 ? (
          <div className="py-40 text-center glass-card border-dashed border-white/10 rounded-3xl">
             <p className="text-white/40 uppercase tracking-widest font-bold mb-8 text-xl">Queue is empty. Your build is pending.</p>
             <Link to="/shop" className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white border border-white transition-all">
               Browse Modules
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
               {items.map((item) => (
                 <motion.div 
                   key={item.id}
                   layout
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="flex gap-8 p-8 glass-card border-white/5 relative group"
                 >
                   <div className="w-24 h-24 bg-white/5 rounded-sm overflow-hidden flex-shrink-0">
                     <img src={item.images[0]} className="w-full h-full object-cover opacity-60" />
                   </div>
                   <div className="flex-grow flex justify-between items-start">
                     <div>
                        <h3 className="text-lg font-bold uppercase tracking-widest mb-1 italic">{item.name}</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{item.category}</p>
                        <div className="mt-4 flex items-center gap-4">
                           <span className="text-xs font-mono opacity-60">Qty: {item.quantity}</span>
                           <span className="text-xs font-mono font-bold">${(item.discountPrice || item.price) * item.quantity}</span>
                        </div>
                     </div>
                     <button 
                       onClick={() => removeFromCart(item.id)}
                       className="p-3 text-white/20 hover:text-red-500 transition-colors"
                     >
                       <Trash2 size={18} />
                     </button>
                   </div>
                   <div className="absolute bottom-0 left-0 w-full h-px bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                 </motion.div>
               ))}
            </div>

            <aside className="space-y-8">
               <div className="p-10 glass-card border-white/5 space-y-8 sticky top-32">
                 <h3 className="text-sm font-black uppercase tracking-widest italic border-b border-white/10 pb-6">Summary_Matrix</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span>Transmission Fee</span>
                      <span>$45.00</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between">
                       <span className="text-sm font-bold uppercase tracking-widest italic">Total Credits</span>
                       <span className="text-xl font-mono italic">${(totalPrice + 45).toFixed(2)}</span>
                    </div>
                 </div>
                 <Link 
                   to="/checkout"
                   className="block w-full py-5 bg-white text-black text-center font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                 >
                   Initialize Checkout
                 </Link>
                 <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 justify-center">
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                    Secure Transaction Layer Active
                 </div>
               </div>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}
