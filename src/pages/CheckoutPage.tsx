import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CreditCard, Box } from 'lucide-react';
import { cn } from '../lib/utils';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

import { MapPin, Navigation, Upload, CheckCircle } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const NEPAL_DATA = {
  provinces: [
    { name: 'Koshi', districts: ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'] },
    { name: 'Madhesh', districts: ['Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha'] },
    { name: 'Bagmati', districts: ['Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha', 'Kathmandu', 'Kavrepalanchok', 'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'] },
    { name: 'Gandaki', districts: ['Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Syangja', 'Tanahu'] },
    { name: 'Lumbini', districts: ['Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilvastu', 'Parasi', 'Palpa', 'Pyuthan', 'Rolpa', 'Rukum East', 'Rupandehi'] },
    { name: 'Karnali', districts: ['Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Rukum West', 'Salyan', 'Surkhet'] },
    { name: 'Sudurpashchim', districts: ['Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Doti', 'Kailali', 'Kanchanpur'] }
  ]
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'esewa'>('card');
  const [paymentSettings, setPaymentSettings] = useState({ esewaNumber: '9800000000', qrCodeUrl: '' });
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [paymentStatement, setPaymentStatement] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    district: '',
    province: '',
    zip: '',
    country: 'Nepal'
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }

    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'payment'));
        if (docSnap.exists()) {
          setPaymentSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error('Error fetching payment settings:', error);
      }
    };
    fetchSettings();
  }, [items, navigate]);

  const detectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using OpenStreetMap (Free)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data.address) {
            setAddress(prev => ({
              ...prev,
              street: data.address.road || data.address.suburb || prev.street,
              city: data.address.city || data.address.town || data.address.village || prev.city,
            }));
          }
        } catch (error) {
          console.error("Geocoding failed", error);
        } finally {
          setIsDetecting(false);
        }
      }, (error) => {
        console.error("Geolocation failed", error);
        setIsDetecting(false);
        alert("PROTOCOL_ERROR: Location detection failed. Please enter manually.");
      });
    } else {
      setIsDetecting(false);
      alert("PROTOCOL_ERROR: Geolocation is not supported by your browser.");
    }
  };

  const handlePlaceOrder = async (e?: React.FormEvent, stripePaymentId?: string) => {
    if (e) e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (paymentMethod === 'esewa' && !paymentScreenshot) {
      alert('PROTOCOL_ERROR: Payment screenshot is mandatory for eSewa verification.');
      return;
    }

    if (paymentMethod === 'card' && !stripePaymentId) {
      const submitBtn = document.getElementById('stripe-submit');
      if (submitBtn) {
        submitBtn.click();
        return;
      }
    }

    setLoading(true);

    const path = 'orders';
    try {
      let screenshotUrl = null;
      if (paymentMethod === 'esewa' && paymentScreenshot) {
        const storage = getStorage();
        const storageRef = ref(storage, `screenshots/${Date.now()}_${paymentScreenshot.name}`);
        const snapshot = await uploadBytes(storageRef, paymentScreenshot);
        screenshotUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, path), {
        userId: user.uid,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.discountPrice || i.price, quantity: i.quantity })),
        total: totalPrice + 45,
        status: 'pending',
        read: false,
        shippingAddress: address,
        paymentMethod,
        paymentId: stripePaymentId || null,
        paymentScreenshot: screenshotUrl,
        paymentStatement: paymentStatement || null,
        createdAt: new Date().toISOString()
      });

      clearCart();
      setOrderSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatePresence>
          {orderSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
            >
              <div className="text-center space-y-8 max-w-md">
                 <div className="w-24 h-24 mx-auto border-2 border-white rounded-full flex items-center justify-center">
                    <CheckCircle className="text-white animate-pulse" size={48} />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter">Mission <span className="text-white/20">Success</span></h2>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Payload successfully deployed. Redirecting to home matrix...</p>
                 </div>
                 <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                      className="h-full bg-white"
                    />
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-20 space-y-6">
          <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold">
            SECURE_CHECKOUT_GATEWAY
          </div>
          <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.8]">Final <br/><span className="text-white/20">Protocol</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <form onSubmit={handlePlaceOrder} className="space-y-12">
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                    <Box size={16} /> Shipping_Destination
                  </h3>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isDetecting}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all group"
                  >
                    {isDetecting ? (
                      <span className="animate-pulse">Scanning_Bio_Location...</span>
                    ) : (
                      <>
                        <Navigation size={12} className="group-hover:animate-bounce" />
                        Detect_Current_Coordinates
                      </>
                    )}
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Province</label>
                    <select 
                      required
                      value={address.province}
                      onChange={(e) => setAddress({...address, province: e.target.value, district: ''})}
                      className="w-full bg-black border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold appearance-none"
                    >
                      <option value="">Select Province</option>
                      {NEPAL_DATA.provinces.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">District</label>
                    <select 
                      required
                      value={address.district}
                      disabled={!address.province}
                      onChange={(e) => setAddress({...address, district: e.target.value})}
                      className="w-full bg-black border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold appearance-none disabled:opacity-20"
                    >
                      <option value="">Select District</option>
                      {address.province && NEPAL_DATA.provinces.find(p => p.name === address.province)?.districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">City</label>
                    <input 
                      type="text" 
                      required
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Postal Code (Optional)</label>
                    <input 
                      type="text" 
                      value={address.zip}
                      onChange={(e) => setAddress({...address, zip: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold"
                    />
                 </div>
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                 <CreditCard size={16} /> Payment_Protocol
               </h3>
               
               <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'card', label: 'Credit_Card' },
                    { id: 'cod', label: 'Cash_Delivery' },
                    { id: 'esewa', label: 'eSewa_QR' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={cn(
                        "py-4 border text-[9px] font-black uppercase tracking-widest transition-all",
                        paymentMethod === method.id 
                          ? "border-white bg-white text-black shadow-[0_0_15px_#fff]" 
                          : "border-white/10 bg-white/5 text-white/40 hover:border-white/30"
                      )}
                    >
                      {method.label}
                    </button>
                  ))}
               </div>

               <AnimatePresence mode="wait">
                 {paymentMethod === 'card' && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="p-8 border border-white/10 rounded-sm bg-white/5"
                   >
                     <Elements stripe={stripePromise}>
                       <CheckoutForm 
                         total={totalPrice + 45} 
                         loading={loading}
                         setLoading={setLoading}
                         onSuccess={(id) => handlePlaceOrder(undefined, id)} 
                       />
                     </Elements>
                   </motion.div>
                 )}

                 {paymentMethod === 'cod' && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="p-8 border border-white/10 rounded-sm bg-white/5 flex items-center justify-center gap-6"
                   >
                      <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/40">
                         <Box size={24} />
                      </div>
                      <div className="space-y-1">
                         <div className="text-[10px] font-black uppercase tracking-widest">Hand-to-Hand Exchange</div>
                         <p className="text-[9px] text-white/30 uppercase tracking-widest">Pay credits upon physical module acquisition.</p>
                      </div>
                   </motion.div>
                 )}

                 {paymentMethod === 'esewa' && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="p-8 border border-white/10 rounded-sm bg-white/5 space-y-8"
                   >
                      <div className="flex justify-between items-start">
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#6cbb23]">eSewa Digital Transfer</div>
                            <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">Scan QR for instant transmission</p>
                         </div>
                         <div className="w-8 h-8 bg-[#6cbb23] rounded-sm flex items-center justify-center text-white font-black text-[10px]">e</div>
                      </div>
                      
                      <div className="aspect-square w-48 mx-auto bg-white p-4 rounded-sm flex items-center justify-center overflow-hidden">
                         {paymentSettings.qrCodeUrl ? (
                           <img src={paymentSettings.qrCodeUrl} alt="eSewa QR" className="w-full h-full object-contain" />
                         ) : (
                           <div className="w-full h-full border-2 border-black border-dashed flex flex-col items-center justify-center text-black text-center p-4">
                              <div className="w-8 h-8 border-2 border-black mb-2 flex items-center justify-center font-bold">QR</div>
                              <div className="text-[8px] font-black uppercase leading-tight">Initialize Scan<br/>eSewa Integration</div>
                           </div>
                         )}
                      </div>

                      <div className="text-center">
                         <div className="text-[9px] font-mono text-white/40 mt-4">TX_ADDRESS: {paymentSettings.esewaNumber}</div>
                         <p className="text-[8px] text-white/20 uppercase tracking-widest mt-2 italic px-8">Transfer exactly ${(totalPrice + 45).toFixed(2)} to the above address via eSewa app.</p>
                      </div>

                      <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Payment Successful Statement</label>
                          <input 
                            type="text" 
                            placeholder="REMARKS / TX_ID / NOTES"
                            value={paymentStatement}
                            onChange={(e) => setPaymentStatement(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 h-14 px-6 text-[11px] focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Proof of Transmission (Screenshot)</label>
                          <label className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl h-24 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-all group overflow-hidden">
                            <input 
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                            />
                            {paymentScreenshot ? (
                              <div className="flex items-center gap-3 text-white">
                                <Upload size={16} className="text-white/40" />
                                <span className="text-[10px] font-black uppercase truncate max-w-[200px]">{paymentScreenshot.name}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                                <Upload size={20} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Select_Screenshot.png</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50"
            >
              {loading ? 'PROCESSING_PAYMENT...' : 'PLACE_ORDER_TRANSMIT'}
            </button>
          </form>

          <aside className="p-10 glass-card h-fit border-white/5 space-y-10">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Build Summary</h3>
             <div className="space-y-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-end border-b border-white/5 pb-4">
                     <div>
                       <div className="text-[10px] font-bold uppercase tracking-widest">{item.name}</div>
                       <div className="text-[10px] text-white/20 font-mono">x{item.quantity}</div>
                     </div>
                     <div className="text-xs font-mono italic">${(item.discountPrice || item.price) * item.quantity}</div>
                  </div>
                ))}
             </div>
             <div className="space-y-4 pt-10">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Shipping</span>
                  <span>$45.00</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between">
                   <span className="text-sm font-bold uppercase tracking-widest italic">Total Credits</span>
                   <span className="text-2xl font-mono italic">${(totalPrice + 45).toFixed(2)}</span>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
