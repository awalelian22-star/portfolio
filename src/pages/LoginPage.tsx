import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Layout from '../components/Layout';
import { cn } from '../lib/utils';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if profile exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google Login not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Set profile in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          displayName: name,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-20 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-card p-12 rounded-3xl border-white/10"
        >
          <div className="text-center mb-10 space-y-4">
             <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold">
               SECURE_PROTOCOL_LOGIN
             </div>
             <h1 className="text-4xl font-black tracking-tighter uppercase italic">
               {isLogin ? 'AUTHENTICATE' : 'INITIALIZE_GEN'}
             </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 h-14 px-6 text-sm focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 h-14 px-6 text-sm focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 h-14 px-6 text-sm focus:outline-none focus:border-white transition-all uppercase tracking-widest font-bold font-mono"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  {error}
                  {error.includes('auth/operation-not-allowed') && (
                    <span className="block mt-2 text-white/40">
                      TECHNICAL NOTE: Operator must enable "Email/Password" or "Google" in Firebase Console &gt; Authentication &gt; Sign-in method.
                    </span>
                  )}
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'TRANSMIT_ACCESS' : 'CREATE_IDENT')}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-black px-4 text-white/20">or alternative protocol</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-5 bg-white/5 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              AUTHENTICATE_VIA_GOOGLE
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              {isLogin ? "Need a clearance? Create Account" : "Registered operator? Authenticate"}
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
