import { motion } from 'motion/react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/src/data/products';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'wishlist'), where('userId', '==', user.uid), where('productId', '==', product.id));
        const snap = await getDocs(q);
        setIsWishlisted(!snap.empty);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };
    checkWishlist();
  }, [user, product.id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      if (isWishlisted) {
        const q = query(collection(db, 'wishlist'), where('userId', '==', user.uid), where('productId', '==', product.id));
        const snap = await getDocs(q);
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'wishlist', d.id))));
        setIsWishlisted(false);
      } else {
        await addDoc(collection(db, 'wishlist'), {
          userId: user.uid,
          productId: product.id,
          createdAt: new Date().toISOString()
        });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-4 overflow-hidden rounded-sm transition-all duration-300 hover:border-white/30">
        {/* Featured Badge */}
        {(product as any).isFeatured && (
          <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest shadow-[0_0_10px_#fff]">
            Featured
          </div>
        )}
        {/* Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 group-hover:opacity-80"
        />

        {/* Hover Stroke Effect like design */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left shadow-[0_0_10px_#fff]" />

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <Link 
            to={`/product/${product.id}`}
            className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-white"
          >
            Details
          </Link>
          <button 
            onClick={toggleWishlist}
            className={cn(
              "p-2 border transition-all",
              isWishlisted ? "border-white bg-white text-black shadow-[0_0_15px_#fff]" : "border-white/20 text-white/40 hover:border-white hover:text-white"
            )}
          >
            <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
          {product.name}
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-white/40 group-hover:text-white/60 transition-colors">
          <span>${product.discountPrice || product.price}</span>
          <span className="uppercase tracking-[0.2em]">{product.category}</span>
        </div>
      </div>
    </motion.div>
  );
}
