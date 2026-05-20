import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/src/components/Layout';
import ProductCard from '@/src/components/ProductCard';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/src/data/products';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getStoredProducts } from '../lib/products-store';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'popular'>('popular');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const stored = await getStoredProducts();
        setProducts(stored);
      } catch (error) {
        console.error('Firestore fallback to sample data:', error);
        setProducts(SAMPLE_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products].filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'popular') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return filtered;
  }, [search, selectedCategory, sortBy, products]);

  return (
    <Layout>
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 space-y-6">
          <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold">
            COLLECTIONS / INVENTORY
          </div>
          <h1 className="text-7xl md:text-[100px] font-black tracking-tighter uppercase italic leading-[0.8]">Master <br/><span className="text-white/20">Inventory</span></h1>
          <p className="text-white/60 max-w-xl text-sm font-light leading-relaxed">
            Explore our meticulously engineered modification systems. Filter by category or search for specific performance modules.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-start lg:items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH SYSTEMS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 h-14 pl-16 pr-8 text-[11px] focus:outline-none focus:border-white/40 transition-all uppercase tracking-widest font-bold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 group cursor-pointer hover:border-white transition-all">
                <SlidersHorizontal size={14} className="text-white/40 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
             </div>

             <div className="flex items-center gap-4 bg-white/5 p-1 border border-white/5">
                {['popular', 'price-asc', 'price-desc'].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort as any)}
                    className={cn(
                      "px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                      sortBy === sort ? "bg-white text-black shadow-[0_0_15px_#fff]" : "text-white/40 hover:text-white"
                    )}
                  >
                    {sort.replace('-', ' ')}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Categories */}
          <div className="lg:w-64 flex-shrink-0 space-y-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-white/80">Systems Category</h3>
              <div className="space-y-4">
                <button
                   onClick={() => setSelectedCategory(null)}
                   className={cn(
                     "flex items-center justify-between w-full text-xs uppercase tracking-widest group transition-all",
                     selectedCategory === null ? "text-white font-bold" : "text-white/40 hover:text-white"
                   )}
                >
                  All Modules
                  <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === null ? "bg-white neon-glow" : "bg-transparent")} />
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "flex items-center justify-between w-full text-xs uppercase tracking-widest group transition-all",
                      selectedCategory === cat ? "text-white font-bold" : "text-white/40 hover:text-white"
                    )}
                  >
                    {cat}
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === cat ? "bg-white neon-glow" : "bg-transparent")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 glass-card rounded-2xl border-white/5">
               <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4">Compatibility</h4>
               <p className="text-[10px] text-white/30 leading-relaxed uppercase">Enter your bike model to see only compatible performance systems.</p>
               <input 
                 type="text" 
                 placeholder="BIKE MODEL..." 
                 className="mt-4 w-full bg-transparent border-b border-white/10 py-2 text-[10px] focus:outline-none focus:border-white transition-all uppercase tracking-widest"
               />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center glass-card rounded-3xl border-dashed border-white/10">
                 <p className="text-white/40 uppercase tracking-widest font-bold">No systems found matching your search</p>
                 <button 
                  onClick={() => {setSearch(''); setSelectedCategory(null);}}
                  className="mt-6 text-xs font-bold underline uppercase tracking-widest hover:text-white transition-colors"
                 >
                   Clear all filters
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
