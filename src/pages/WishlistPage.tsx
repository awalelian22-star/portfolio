import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'wishlist'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const items = await Promise.all(
        querySnapshot.docs.map(async (wishDoc) => {
          const data = wishDoc.data();
          const productRef = doc(db, 'products', data.productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            return { 
              wishId: wishDoc.id, 
              ...productSnap.data(), 
              id: productSnap.id 
            };
          }
          return null;
        })
      );
      
      setWishlistItems(items.filter(item => item !== null));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (wishId: string) => {
    try {
      await deleteDoc(doc(db, 'wishlist', wishId));
      setWishlistItems(prev => prev.filter(item => item.wishId !== wishId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="py-40 text-center uppercase tracking-widest">
           <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
           <p className="text-white/40 mb-8">Authentication required for wishlist synchronization.</p>
           <Link to="/login" className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest border border-white">Initialize Login</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold uppercase">
              Rider_Vault / {user.uid.slice(0, 8)}
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
              Saved <br/><span className="text-white/20">Modules</span>
            </h1>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30 max-w-[200px] leading-relaxed">
            Persistent storage for prioritized technical acquisitions.
          </p>
        </div>

        {loading ? (
          <div className="py-40 text-center animate-pulse uppercase tracking-widest text-white/20 font-bold">Accessing Vault...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="py-40 text-center glass-card border-dashed border-white/10 rounded-sm">
             <Heart size={48} className="mx-auto mb-6 text-white/10" />
             <p className="text-white/20 uppercase tracking-widest font-bold mb-8">Vault is currently empty of targeted modules.</p>
             <Link to="/shop" className="px-10 py-4 bg-white text-black font-black text-xs uppercase tracking-widest border border-white hover:bg-black hover:text-white transition-all">Browse Inventory</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence>
              {wishlistItems.map((product) => (
                <motion.div 
                  key={product.wishId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group outline-none"
                >
                  <ProductCard product={product} />
                  <button 
                    onClick={() => removeFromWishlist(product.wishId)}
                    className="absolute top-4 right-4 z-20 p-3 bg-black/80 backdrop-blur-md border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
