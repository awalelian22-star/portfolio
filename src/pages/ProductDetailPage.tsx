import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/src/components/Layout';
import ProductCard from '@/src/components/ProductCard';
import { SAMPLE_PRODUCTS } from '@/src/data/products';
import { motion, AnimatePresence } from 'motion/react';
import { getStoredProducts } from '../lib/products-store';
import { ShoppingCart, Heart, Shield, Rotate3d, Package, Info, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'details' | 'compatibility' | 'reviews'>('details');
  const [product, setProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { user, profile } = useAuth();

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const q = query(collection(db, 'reviews'), where('productId', '==', id), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setReviews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const stored = await getStoredProducts();
        setProducts(stored);
        const found = stored.find(p => p.id === id);
        if (found) {
          setProduct(found);
        } else {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() });
          } else {
            setProduct(null);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        const stored = await getStoredProducts();
        setProducts(stored);
        const found = stored.find(p => p.id === id);
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: id,
        userId: user.uid,
        userName: profile?.displayName || user.email?.split('@')[0] || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString()
      });
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
      alert('Module Evaluation Transmitted Successfully');
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  const [isWishlisted, setIsWishlisted] = useState(false);
  const checkWishlist = async () => {
    if (!user || !id) return;
    try {
      const q = query(collection(db, 'wishlist'), where('userId', '==', user.uid), where('productId', '==', id));
      const snap = await getDocs(q);
      setIsWishlisted(!snap.empty);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  useEffect(() => {
    checkWishlist();
  }, [user, id]);

  const toggleWishlist = async () => {
    if (!user || !id) return;
    try {
      if (isWishlisted) {
        const q = query(collection(db, 'wishlist'), where('userId', '==', user.uid), where('productId', '==', id));
        const snap = await getDocs(q);
        await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'wishlist', d.id))));
        setIsWishlisted(false);
      } else {
        await addDoc(collection(db, 'wishlist'), {
          userId: user.uid,
          productId: id,
          createdAt: new Date().toISOString()
        });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-40 text-center uppercase tracking-widest animate-pulse">
           <h1 className="text-2xl font-bold mb-4 text-white/20">Scanning Module...</h1>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="py-40 text-center uppercase tracking-widest">
           <h1 className="text-4xl font-bold mb-4">Module Not Found</h1>
           <Link to="/shop" className="underline text-white/40 hover:text-white">Return to Inventory</Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <Layout>
      <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 mb-12 text-[10px] font-bold uppercase tracking-widest text-white/30">
          <Link to="/" className="hover:text-white">Hangar</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-white">Inventory</Link>
          <ChevronRight size={12} />
          <span className="text-white/60">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square glass-card rounded-3xl overflow-hidden group">
               <motion.img 
                 key={activeImage}
                 initial={{ opacity: 0, scale: 1.1 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.6 }}
                 src={product.images[activeImage]} 
                 className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
               />
               <div className="absolute top-8 right-8">
                  <button className="p-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:neon-border transition-all">
                    <Rotate3d size={24} />
                  </button>
               </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden glass-card border-2 transition-all p-1",
                    activeImage === i ? "border-white" : "border-white/5 opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold">
                  {product.category} / MOD
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase">
                  <Star size={12} className="fill-white" />
                  <span>{product.rating}</span>
                  <span className="opacity-30">({product.reviewCount} REVIEW_NODES)</span>
                </div>
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.8]">{product.name}</h1>
              <div className="flex items-center gap-6">
                {product.discountPrice ? (
                  <>
                    <span className="text-4xl font-mono tracking-tighter italic">${product.discountPrice}</span>
                    <span className="text-xl text-white/20 line-through font-mono tracking-tighter italic">${product.price}</span>
                  </>
                ) : (
                  <span className="text-4xl font-mono tracking-tighter italic">${product.price}</span>
                )}
                {product.stock > 0 ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                    SYSTEM_ACTIVE_READY
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">OFFLINE</span>
                )}
              </div>
            </div>

            <p className="text-white/60 leading-relaxed text-sm font-light mb-10">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="p-4 glass-card border-white/5">
                  <div className="text-[10px] font-bold tracking-widest opacity-30 mb-2 uppercase italic">Weight_Bias</div>
                  <div className="text-lg font-mono tracking-tighter italic">{product.specs?.Weight || 'N/A'}</div>
               </div>
               <div className="p-4 glass-card border-white/5">
                  <div className="text-[10px] font-bold tracking-widest opacity-30 mb-2 uppercase italic">Composition</div>
                  <div className="text-lg font-mono tracking-tighter italic">{product.specs?.Material || 'Alloy'}</div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
               <button 
                onClick={() => addToCart(product)}
                className="flex-grow px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
               >
                 Initialize Build
               </button>
               <button 
                onClick={toggleWishlist}
                className={cn(
                  "flex-none p-5 border transition-all",
                  isWishlisted ? "border-white bg-white text-black shadow-[0_0_15px_white]" : "border-white/20 hover:border-white hover:bg-white/10"
                )}
               >
                 <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
               </button>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-white/5">
               <div className="flex items-center gap-3">
                 <Shield size={16} className="text-white/30" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Lifetime Warranty</span>
               </div>
               <div className="flex items-center gap-3">
                 <Package size={16} className="text-white/30" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Express Global</span>
               </div>
               <div className="flex items-center gap-3">
                 <Info size={16} className="text-white/30" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Pro Installation</span>
               </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <section className="mt-32 border-t border-white/5 pt-20">
          <div className="flex gap-12 mb-16 border-b border-white/5">
             {['details', 'compatibility', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as any)}
                  className={cn(
                    "pb-8 text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative",
                    selectedTab === tab ? "text-white" : "text-white/30 hover:text-white"
                  )}
                >
                  {tab}
                  {selectedTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white shadow-[0_0_8px_white]" />
                  )}
                </button>
             ))}
          </div>

          <div className="min-h-[300px]">
             {selectedTab === 'details' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold uppercase tracking-widest">Tech Specs</h3>
                    <div className="space-y-4">
                      {Object.entries(product.specs || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between border-b border-white/5 pb-4">
                          <span className="text-[10px] uppercase tracking-widest text-white/40">{key}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">{val as string}</span>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold uppercase tracking-widest">Aerodynamics & Performance</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      This module has been subjected to 400+ hours of wind tunnel testing to ensure optimal fluid dynamics. The unique geometry creates a low-pressure zone that facilitates faster heat extraction from critical areas, while the structural integrity is maintained using advanced multi-layer composites.
                    </p>
                 </div>
               </motion.div>
             )}

             {selectedTab === 'compatibility' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="p-8 glass-card rounded-2xl border-white/5 bg-white/[0.02]">
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Confirmed Compatibility</h4>
                    <div className="flex flex-wrap gap-4">
                       {(product.compatibleModels || []).map((model: string) => (
                         <span key={model} className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-white transition-all">
                           {model}
                         </span>
                       ))}
                    </div>
                  </div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest leading-relaxed">
                    * Modules may require specialized mounting hardware for models not listed here. Contact our technical support for custom installation frameworks.
                  </p>
               </motion.div>
             )}

             {selectedTab === 'reviews' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                       <div className="text-4xl font-bold font-mono">{product.rating}</div>
                       <div className="space-y-1">
                          <div className="flex gap-1">
                             {[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= Math.floor(product.rating) ? "fill-white" : "text-white/10"} />)}
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest opacity-30">{reviews.length} Verified Responses</div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-8 py-3 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      {showReviewForm ? 'Abort Evaluation' : 'Post Evaluation'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showReviewForm && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <form onSubmit={handlePostReview} className="p-8 glass-card border-white/10 space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Rating_Shift</label>
                              <div className="flex gap-2">
                                {[1,2,3,4,5].map(i => (
                                  <button 
                                    key={i} 
                                    type="button" 
                                    onClick={() => setNewReview({...newReview, rating: i})}
                                    className={cn("p-2 border transition-all", newReview.rating >= i ? "border-white bg-white text-black" : "border-white/10 text-white/40")}
                                  >
                                    <Star size={16} fill={newReview.rating >= i ? "currentColor" : "none"} />
                                  </button>
                                ))}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Technical_Verdict</label>
                              <textarea 
                                value={newReview.comment}
                                onChange={e => setNewReview({...newReview, comment: e.target.value})}
                                required
                                className="w-full bg-white/5 border border-white/10 p-6 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white h-32"
                                placeholder="IDENTIFY STRENGTHS AND OPERATIONAL LIMITS..."
                              />
                           </div>
                           <button type="submit" className="px-12 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest shadow-[0_0_15px_white]">
                              Transmit Verdict
                           </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-8">
                     {reviews.map((review) => (
                       <div key={review.id} className="p-8 border-b border-white/5 space-y-4">
                          <div className="flex justify-between items-start">
                             <div className="space-y-2">
                                <div className="flex gap-1">
                                   {[1,2,3,4,5].map(i => <Star key={i} size={10} className={i <= review.rating ? "fill-white" : "text-white/10"} />)}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest italic">{review.userName}</div>
                             </div>
                             <div className="text-[8px] font-mono text-white/20">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                          <p className="text-sm font-light text-white/60 leading-relaxed uppercase tracking-wide">
                             {review.comment}
                          </p>
                       </div>
                     ))}
                     {reviews.length === 0 && !showReviewForm && (
                       <div className="text-center py-20 text-[10px] uppercase tracking-widest text-white/20 italic">
                          No module evaluations recorded for this unit.
                       </div>
                     )}
                  </div>
               </motion.div>
             )}
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-40">
           <div className="mb-16">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold block mb-4">SYSTEMS SYNERGY</span>
              <h2 className="text-4xl font-bold uppercase tracking-tighter">Compatible Upgrades</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
           </div>
        </section>
      </div>
    </Layout>
  );
}
