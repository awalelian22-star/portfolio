import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Box, ShoppingBag, Users, Settings, Plus, 
  ArrowUpRight, TrendingUp, DollarSign, Package, LogOut, Search,
  Edit2, Trash2, CheckCircle, Clock, Bell, X, Truck, AlertTriangle,
  ExternalLink, MapPin, FileText, Image as ImageIcon
} from 'lucide-react';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/src/data/products';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, orderBy, limit, addDoc, doc, updateDoc, deleteDoc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';
import { getStoredProducts, addStoredProduct, updateStoredProduct, deleteStoredProduct, seedLocalProducts } from '../lib/products-store';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'settings' | 'payments'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({ esewaNumber: '9800000000', qrCodeUrl: '' });
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    price: 0,
    stock: 50,
    description: '',
    imageUrl: '',
    isFeatured: false,
    specs: { Material: 'Carbon Fiber', Weight: '1.2kg' },
    compatibleModels: ['ALL_SYSTEMS']
  });
  const { user, logout } = useAuth();
  const isMe = user?.email === 'prabhakarmahato777@gmail.com' || user?.email === 'awalelian22@gmail.com';

  const fetchProducts = async () => {
    try {
      const stored = await getStoredProducts();
      setProducts(stored);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts(SAMPLE_PRODUCTS);
    }
  };

  useEffect(() => {
    // Real-time Orders Listener for Notifications
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setOrders(newOrders);
      
      // Filter for unread notifications (e.g., within last 5 minutes or based on a flag)
      const fresh = newOrders.filter(o => !o.read);
      setNotifications(fresh);
    });

    fetchProducts();

    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'payment'));
        if (docSnap.exists()) {
          setPaymentSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();

    return () => unsubscribe();
  }, []);

  const markAllAsRead = async () => {
    if (!isMe) return;
    const path = 'orders';
    try {
      const unread = orders.filter(o => !o.read);
      await Promise.all(unread.map(o => 
        updateDoc(doc(db, path, o.id), { read: true })
      ));
      setNotifications([]);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMe) {
      alert('PROTOCOL_ERROR: Unauthorized access to initialization vector.');
      return;
    }
    try {
      await addStoredProduct({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc'],
        isFeatured: formData.isFeatured,
        specs: formData.specs,
        compatibleModels: formData.compatibleModels,
        tags: ['performance'],
        rating: 5,
        reviewCount: 0
      }, isMe);
      alert('Module Initialized Successfully');
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Add product error:', error);
      alert('An error occurred while initializing the module.');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !isMe) return;
    try {
      await updateStoredProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : editingProduct.images,
        isFeatured: formData.isFeatured,
        specs: formData.specs,
        compatibleModels: formData.compatibleModels
      }, isMe);
      alert('Module Updated Successfully');
      setShowEditModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Update product error:', error);
      alert('An error occurred while transmitting updates.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!isMe) {
      alert('PROTOCOL_ERROR: Decommissioning requires Level 5 Clearance.');
      return;
    }
    if (!window.confirm('PROTOCOL_WARNING: Persistent deletion requested. Confirm?')) return;
    try {
      await deleteStoredProduct(id, isMe);
      alert('Module Decommissioned');
      fetchProducts();
    } catch (error) {
      console.error('Delete product error:', error);
      alert('An error occurred while decommissioning the module.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: CATEGORIES[0],
      price: 0,
      stock: 50,
      description: '',
      imageUrl: '',
      isFeatured: false,
      specs: { Material: 'Carbon Fiber', Weight: '1.2kg' },
      compatibleModels: ['ALL_SYSTEMS']
    });
    setEditingProduct(null);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.images?.[0] || '',
      isFeatured: product.isFeatured || false,
      specs: product.specs || { Material: 'N/A', Weight: 'N/A' },
      compatibleModels: product.compatibleModels || ['ALL']
    });
    setShowEditModal(true);
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMe) {
        alert('PROTOCOL_ERROR: Transmission rejected.');
        return;
    }
    const path = 'settings/payment';
    try {
      await setDoc(doc(db, 'settings', 'payment'), paymentSettings);
      alert('Payment Protocol Successfully Transmitted');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!isMe) {
        alert('PROTOCOL_ERROR: Pulse modification locked.');
        return;
    }
    const path = 'orders';
    try {
      await updateDoc(doc(db, path, orderId), { status: newStatus });
      alert(`Order Status Updated to: ${newStatus.toUpperCase()}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${orderId}`);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Systems Overview', icon: <BarChart3 size={20} /> },
    { id: 'products', label: 'Modification Modules', icon: <Box size={20} /> },
    { id: 'orders', label: 'Order Processing', icon: <ShoppingBag size={20} /> },
    { id: 'payments', label: 'Payment Logs', icon: <DollarSign size={20} /> },
    { id: 'customers', label: 'Rider Database', icon: <Users size={20} /> },
    { id: 'settings', label: 'System Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-black p-8 flex flex-col gap-12 fixed h-full z-20">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-white" />
              </div>
            <h1 className="text-xl font-bold tracking-tighter uppercase italic text-glow">ADMIN_MOD</h1>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">Operational Protocol v3.2</p>
        </div>

        <nav className="flex-grow space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === item.id 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] font-black italic" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
          <button 
           onClick={() => logout()}
           className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors px-4"
          >
            <LogOut size={16} />
            Eject Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-80 flex-grow p-12">
        {!isMe && (
          <div className="mb-8 p-4 border border-orange-500/30 bg-orange-500/5 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-orange-500" size={18} />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80 italic">
                Observer Mode Active: System_Control_Locked
              </div>
            </div>
            <div className="text-[8px] font-mono text-orange-500/40">AUTH_SIG: {user?.email || 'ANONYMOUS_PROBE'}</div>
          </div>
        )}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH SYSTEM DATA..."
                className="bg-white/5 border border-white/10 h-12 pl-12 pr-6 rounded-sm text-xs font-bold uppercase tracking-widest w-80 focus:outline-none focus:border-white/40"
              />
            </div>
            
            <div className="relative">
               <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllAsRead();
                }}
                className="p-3 border border-white/10 hover:border-white transition-all relative group"
               >
                 <Bell size={18} className={cn(notifications.length > 0 && "animate-bounce text-white")} />
                 {notifications.length > 0 && (
                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-[10px] font-black flex items-center justify-center rounded-full shadow-[0_0_10px_#fff]">
                     {notifications.length}
                   </span>
                 )}
               </button>

               <AnimatePresence>
                 {showNotifications && (
                   <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 glass-card bg-black border border-white/20 z-50 p-4 shadow-2xl rounded-sm"
                   >
                      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                         <h4 className="text-[10px] font-black uppercase tracking-widest italic">System_Alerts</h4>
                         <span className="text-[8px] font-bold text-white/40 uppercase">Real-Time Sync</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                         {orders.slice(0, 5).map(order => (
                           <div key={order.id} className="p-3 bg-white/5 border border-white/5 rounded-sm hover:border-white/20 transition-all">
                              <div className="flex justify-between items-start mb-1">
                                 <span className={cn(
                                   "text-[9px] font-black uppercase tracking-tighter",
                                   order.paymentId ? "text-green-500" : "text-white"
                                 )}>
                                   {order.paymentId ? 'Payment Confirmed' : 'New Transmission'}
                                 </span>
                                 <span className="text-[8px] font-mono opacity-40">${order.total}</span>
                              </div>
                              <p className="text-[8px] text-white/40 uppercase leading-snug">
                                {order.paymentId 
                                  ? `Credit verification successful for Unit ${order.id.slice(0,8)}.` 
                                  : `Order ${order.id.slice(0,8)} initialized by user.`}
                              </p>
                           </div>
                         ))}
                         {orders.length === 0 && (
                           <div className="py-8 text-center text-[10px] uppercase tracking-widest text-white/20">No active transmissions</div>
                         )}
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              disabled={!isMe}
              className={cn(
                "bg-white text-black px-8 py-4 rounded-sm font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:neon-border transition-all shadow-[0_0_15px_#fff]",
                !isMe && "opacity-20 cursor-not-allowed grayscale"
              )}
            >
              <Plus size={18} />
              Add Module
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { 
                  label: 'System Revenue', 
                  value: `$${orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0).toLocaleString()}`, 
                  trend: '+12%', 
                  icon: <DollarSign size={20} /> 
                },
                { 
                  label: 'Active Builds', 
                  value: orders.filter(o => o.status === 'pending' || o.status === 'shipped').length.toString(), 
                  trend: '+8%', 
                  icon: <Package size={20} /> 
                },
                { 
                  label: 'Rider Database', 
                  value: Array.from(new Set(orders.map(o => o.userId))).length.toString(), 
                  trend: '+24%', 
                  icon: <Users size={20} /> 
                },
                { 
                  label: 'Success Rate', 
                  value: orders.length > 0 ? `${((orders.filter(o => o.status === 'completed').length / orders.length) * 100).toFixed(1)}%` : '100%', 
                  trend: '+0.2%', 
                  icon: <CheckCircle size={20} /> 
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-10 rounded-sm border-white/5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-white/40 transition-colors">
                     {stat.icon}
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">{stat.label}</h4>
                  <div className="text-3xl font-mono font-bold mb-2 italic tracking-tighter">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{stat.trend}</span>
                    <ArrowUpRight size={12} className="text-white/40" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="glass-card rounded-sm p-10 border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-10 opacity-60 italic">Revenue Matrix</h3>
                  <div className="w-full h-64 flex items-end justify-between gap-2">
                    {[40, 60, 45, 90, 65, 80, 55, 30, 95, 70, 85, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="flex-grow bg-white/10 hover:bg-white transition-all relative group"
                      />
                    ))}
                  </div>
               </div>
               
               <div className="glass-card rounded-sm p-10 border-white/5 overflow-hidden">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-10 opacity-60 italic">Real-time Order Feed</h3>
                  <div className="space-y-6">
                    {orders.map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all rounded-sm group">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-white opacity-20 group-hover:opacity-100 group-hover:neon-glow transition-all shadow-[0_0_5px_#fff]" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest italic">{order.userId.slice(0, 8)}...</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Credits: ${order.total}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 italic">{order.status}</p>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-center py-10 opacity-30 text-[10px] font-bold uppercase tracking-[0.3em]">No incoming transmissions</p>}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-8">Active_Transmissions</h2>
            <div className="glass-card rounded-sm overflow-hidden border-white/5">
               <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Transmission_ID</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Customer_Node</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Destination</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Credit_Total</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Status_Pulse</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black text-right">Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-8 text-xs font-mono font-bold italic tracking-wider">#{order.id.slice(0, 8)}</td>
                        <td className="px-10 py-8">
                           <div className="text-xs font-bold uppercase tracking-widest">{order.userId.slice(0, 12)}...</div>
                           <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{order.paymentMethod || 'SECURE_VAULT'}</div>
                           {order.paymentScreenshot && (
                             <a 
                               href={order.paymentScreenshot} 
                               target="_blank" 
                               rel="noreferrer"
                               className="inline-flex items-center gap-2 mt-2 text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
                             >
                               <ImageIcon size={10} />
                               View Screenshot
                               <ExternalLink size={10} />
                             </a>
                           )}
                        </td>
                        <td className="px-10 py-8">
                           <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-relaxed">
                              {order.shippingAddress?.street}<br/>
                              {order.shippingAddress?.city}, {order.shippingAddress?.district}<br/>
                              {order.shippingAddress?.province}
                           </div>
                           {order.paymentStatement && (
                              <div className="mt-3 flex items-start gap-2 p-2 bg-white/5 border border-white/10 rounded text-[9px] font-mono italic text-white/40">
                                 <FileText size={10} className="mt-0.5 shrink-0" />
                                 <span className="break-all">{order.paymentStatement}</span>
                              </div>
                           )}
                        </td>
                        <td className="px-10 py-8 text-xs font-mono font-bold italic">${order.total}</td>
                        <td className="px-10 py-8">
                          <span className={cn(
                            "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border",
                            order.status === 'completed' ? "border-green-500/50 text-green-500 bg-green-500/5" : 
                            order.status === 'shipped' ? "border-blue-500/50 text-blue-500 bg-blue-500/5" :
                            "border-orange-500/50 text-orange-500 bg-orange-500/5"
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <select 
                                value={order.status} 
                                disabled={!isMe}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={cn(
                                  "bg-white/5 border border-white/10 text-[9px] font-black uppercase px-4 h-8 focus:outline-none focus:border-white transition-all appearance-none cursor-pointer",
                                  !isMe && "opacity-40 cursor-not-allowed"
                                )}
                              >
                                <option value="pending">Authorize</option>
                                <option value="shipped">Transmit</option>
                                <option value="completed">Finalize</option>
                                <option value="cancelled">Decommission</option>
                              </select>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] uppercase tracking-widest text-white/20">No active transmissions detected</td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Payment_Verifications</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mt-2">Log of all confirmed credit transmissions across the network.</p>
              </div>
              <div className="glass-card px-6 py-4 border-white/5 flex gap-8">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Total Verified</p>
                  <p className="text-sm font-mono font-bold">${orders.filter(o => o.paymentId).reduce((acc, o) => acc + o.total, 0)}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Success Rate</p>
                  <p className="text-sm font-mono font-bold">100%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {orders.filter(o => o.paymentId).map((order) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={order.id} 
                  className="glass-card p-8 border-white/5 flex flex-col md:flex-row justify-between gap-8 hover:border-white/20 transition-all group"
                >
                  <div className="flex gap-8">
                     <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-white/20 bg-white/5">
                        <CheckCircle size={32} className="group-hover:text-white transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-2 py-0.5 shadow-[0_0_10px_#fff]">Confirmed</span>
                           <span className="text-xs font-mono font-bold text-white/60">TRX_{order.paymentId.slice(-12)}</span>
                        </div>
                        <h4 className="text-sm font-bold uppercase tracking-widest italic leading-tight">
                           Order #{order.id.slice(0, 12)}
                        </h4>
                        <div className="flex gap-4 items-center">
                           <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Amount: <span className="text-white">${order.total}</span></div>
                           <div className="w-1 h-1 rounded-full bg-white/10" />
                           <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Method: <span className="text-white">{order.paymentMethod}</span></div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col justify-between text-right gap-4">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Customer_Node</p>
                        <p className="text-[10px] font-mono text-white/40">{order.userId}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Timestamp</p>
                        <p className="text-[10px] font-mono text-white/40">{new Date(order.createdAt).toLocaleString()}</p>
                     </div>
                  </div>
                </motion.div>
              ))}
              {orders.filter(o => o.paymentId).length === 0 && (
                <div className="glass-card p-20 text-center border-dashed border-white/5 flex flex-col items-center gap-4">
                   <Clock size={40} className="text-white/10" />
                   <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">No payment confirmations recorded in current cycle.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-8">Rider_Pulse_Database</h2>
            <div className="glass-card rounded-sm overflow-hidden border-white/5">
               <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Rider_Alias</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Network_Joined</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Activity_Level</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Derived from orders for demonstration */}
                    {Array.from(new Set(orders.map(o => o.userId))).map((userId, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/20 bg-white/5">
                                 <Users size={16} />
                              </div>
                              <div>
                                 <div className="text-xs font-bold uppercase tracking-widest">RIDER_{userId.slice(0, 8)}</div>
                                 <div className="text-[9px] text-white/30 uppercase font-mono italic">UID: {userId}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-[10px] text-white/40 font-bold uppercase italic">STARDATE 2024.05</td>
                        <td className="px-10 py-8">
                           <div className="text-xs font-bold uppercase text-white/60">{orders.filter(o => o.userId === userId).length} Modules Acquired</div>
                        </td>
                        <td className="px-10 py-8">
                           <span className="text-[9px] font-black uppercase tracking-widest text-green-500 italic">VERIFIED_RIDER</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="glass-card rounded-sm overflow-hidden border-white/5">
               <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Module</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Category</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Integrity</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black">Credits</th>
                      <th className="px-10 py-6 text-[10px] uppercase tracking-widest text-white/40 font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white/5 overflow-hidden rounded-sm border border-white/10 p-1">
                               <img src={product.images?.[0]} className="w-full h-full object-cover opacity-60" />
                             </div>
                             <div>
                                <p className="text-xs font-bold uppercase tracking-widest italic group-hover:text-white transition-colors">{product.name}</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">UID: {product.id.slice(0, 8)}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-[10px] uppercase tracking-widest text-white/60 font-bold">{product.category}</td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3">
                              <div className="flex-grow h-px bg-white/10 rounded-full overflow-hidden max-w-[100px]">
                                 <div className="h-full bg-white opacity-40 group-hover:opacity-100 group-hover:neon-glow transition-all" style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }} />
                              </div>
                              <span className={cn(
                                "text-[10px] font-mono font-bold italic flex items-center gap-2",
                                product.stock <= 5 ? "text-red-500 animate-pulse" : "opacity-40"
                              )}>
                                {product.stock <= 5 && <AlertTriangle size={10} />}
                                {product.stock}U
                              </span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-xs font-mono font-bold italic">${product.price}</td>
                        <td className="px-10 py-8 text-right">
                           <div className={cn("flex items-center justify-end gap-3 transition-all", isMe ? "opacity-20 group-hover:opacity-100" : "opacity-10")}>
                              <button 
                                onClick={() => openEdit(product)}
                                disabled={!isMe}
                                className={cn(
                                  "p-2 border border-white/20 hover:border-white transition-all cursor-pointer",
                                  !isMe && "cursor-not-allowed"
                                )}
                              >
                                <Edit2 size={12} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={!isMe}
                                className={cn(
                                  "p-2 border border-white/20 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer",
                                  !isMe && "cursor-not-allowed"
                                )}
                              >
                                <Trash2 size={12} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-12">
             <div className="glass-card p-10 rounded-sm border-white/5 bg-white/[0.01]">
                <h3 className="text-xl font-bold uppercase tracking-tighter italic mb-8 italic">Payment Protocol Configuration</h3>
                
                <form onSubmit={handleUpdatePayment} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">eSewa Receive Number</label>
                    <input 
                      type="text" 
                      value={paymentSettings.esewaNumber}
                      onChange={e => setPaymentSettings({...paymentSettings, esewaNumber: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all font-mono" 
                      placeholder="9800000000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">eSewa QR Image URL</label>
                    <input 
                      type="url" 
                      value={paymentSettings.qrCodeUrl}
                      onChange={e => setPaymentSettings({...paymentSettings, qrCodeUrl: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all font-mono" 
                      placeholder="https://..."
                    />
                    <p className="text-[8px] text-white/20 uppercase tracking-widest mt-2 italic">Upload QR to image host and paste direct link here</p>
                  </div>

                  {paymentSettings.qrCodeUrl && (
                    <div className="p-4 bg-white rounded-sm w-48 aspect-square">
                       <img src={paymentSettings.qrCodeUrl} alt="QR Preview" className="w-full h-full object-contain" />
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={!isMe}
                    className={cn(
                      "px-12 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest shadow-[0_0_15px_#fff] hover:scale-105 transition-transform",
                      !isMe && "opacity-20 cursor-not-allowed"
                    )}
                  >
                    Update Protocol
                  </button>
                </form>
             </div>

             <div className="glass-card p-10 rounded-sm border-white/20 bg-blue-500/5 mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-6 italic">Database Initialization</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Populate the system with standard modification modules from the backup core.</p>
                <button 
                  onClick={async () => {
                    if (!isMe) return;
                    if (!window.confirm('PROTOCOL_WARNING: This will populate the database with sample products. Continue?')) return;
                    try {
                      seedLocalProducts(SAMPLE_PRODUCTS);
                      const path = 'products';
                      await Promise.all(SAMPLE_PRODUCTS.map(p => 
                        setDoc(doc(db, path, p.id), {
                          ...p,
                          createdAt: new Date().toISOString()
                        }).catch(err => console.warn('Sync ignore:', err))
                      ));
                      alert('CORE_STREAMS_INITIALIZED: Database seeded successfully.');
                      fetchProducts();
                    } catch (error) {
                      console.error('Seeding failed:', error);
                      alert('PROTOCOL_ERROR: Seeding sequence interrupted.');
                    }
                  }}
                  disabled={!isMe}
                  className={cn(
                    "px-6 py-3 border border-blue-500/40 text-blue-500 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all",
                    !isMe && "opacity-20 cursor-not-allowed"
                  )}
                >
                  Seed System Matrix
                </button>
             </div>

             <div className="glass-card p-10 rounded-sm border-white/20 bg-red-500/5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-6 italic">Danger Zone</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Irreversible actions that affect entire system matrix.</p>
                <button 
                  onClick={async () => {
                    if (!isMe) return;
                    if (!window.confirm('PROTOCOL_CRITICAL: Complete database reset requested. All transmissions will be permanently purged. Confirm?')) return;
                    try {
                      seedLocalProducts([]);
                      // Note: Client-side deletion of entire collections is limited. 
                      // This is a simplified version that deletes current products.
                      await Promise.all(products.map(p => deleteDoc(doc(db, 'products', p.id)).catch(err => console.warn('Sync ignore:', err))));
                      alert('SYSTEM_WIPE_COMPLETE: Matrix reset to zero-state.');
                      fetchProducts();
                    } catch (error) {
                      console.error('Reset failed:', error);
                      alert('PROTOCOL_ERROR: Wipe sequence failed.');
                    }
                  }}
                  disabled={!isMe}
                  className={cn(
                    "px-6 py-3 border border-red-500/40 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all",
                    !isMe && "opacity-20 cursor-not-allowed"
                  )}
                >
                  Reset System Database
                </button>
             </div>
          </div>
        )}
      </main>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="relative w-full max-w-2xl bg-black border border-white/10 p-12 overflow-y-auto max-h-[90vh] rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.1)]"
             >
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">{showEditModal ? 'UPDATE_MODULE' : 'INITIALIZE_MODULE'}</h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1">{showEditModal ? 'Modify existing modification parameters' : 'Add new modification to the master database'}</p>
                  </div>
                  <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="text-white/40 hover:text-white"><X size={24} /></button>
                </div>

                <form className="space-y-8" onSubmit={showEditModal ? handleUpdateProduct : handleAddProduct}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Module Name</label>
                        <input 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all uppercase tracking-widest font-black" required placeholder="TITAN-X EXHAUST..." 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">System Category</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all uppercase tracking-widest font-black appearance-none"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Credit Cost</label>
                        <input 
                          type="number" 
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all font-mono" required placeholder="0.00" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Stock Integrity</label>
                        <input 
                          type="number" 
                          value={formData.stock}
                          onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all font-mono" required placeholder="100" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Module Image URL</label>
                        <input 
                          type="url" 
                          value={formData.imageUrl}
                          onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all font-mono" placeholder="https://..." 
                        />
                     </div>
                     <div className="flex items-center gap-4 h-14 mt-auto">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Feature on Dashboard</label>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                          className={cn(
                            "w-12 h-6 border transition-all relative flex items-center px-1 rounded-full",
                            formData.isFeatured ? "border-white bg-white/20" : "border-white/10 bg-white/5"
                          )}
                        >
                          <motion.div 
                            animate={{ x: formData.isFeatured ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_#fff]"
                          />
                        </button>
                     </div>
                   </div>

                   {/* Technical Specs Editor */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Technical Specifications</label>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(formData.specs).map(([key, val]) => (
                          <div key={key} className="flex gap-2">
                             <input 
                              readOnly 
                              value={key} 
                              className="w-1/3 bg-white/5 border border-white/10 h-12 px-4 text-[9px] font-bold uppercase opacity-50"
                             />
                             <input 
                              value={val as string} 
                              onChange={e => setFormData({
                                ...formData, 
                                specs: { ...formData.specs, [key]: e.target.value }
                              })}
                              className="w-2/3 bg-white/5 border border-white/10 h-12 px-4 text-[10px] font-bold uppercase focus:border-white"
                             />
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Module Description</label>
                        <textarea 
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 p-6 text-[11px] h-32 focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold" required placeholder="ENTER TECHNICAL SPECIFICATIONS..." 
                        />
                   </div>
                   <div className="pt-8 flex justify-end gap-6 border-t border-white/5">
                      <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="px-8 py-4 border border-white/20 text-[10px] font-bold tracking-widest uppercase hover:bg-white/5">Abort</button>
                      <button type="submit" className="px-12 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest shadow-[0_0_15px_#fff]">
                        {showEditModal ? 'Update Transmission' : 'Transmit Module'}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
