import { useState } from 'react';
import { motion } from 'motion/react';
import Layout from '@/src/components/Layout';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <Layout>
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-4 block"
          >
            COMMUNICATION / INTERFACE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8"
          >
            Get In <span className="text-white/20">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-white/60 text-lg leading-relaxed"
          >
            Have questions about a specific modification or need technical support? Our team of specialists is ready to assist you in building your dream machine.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Details */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold uppercase italic tracking-tight">Direct Channels</h2>
              <div className="space-y-6">
                {[
                  { icon: <Mail size={20} />, label: 'Email', value: 'prabhakarmahato777@gmail.com', sub: '24/7 Response time' },
                  { icon: <Phone size={20} />, label: 'Technical Support', value: '9700032230', sub: 'Mon-Sun 08:00 - 22:00' },
                  { icon: <MapPin size={20} />, label: 'Logistics', value: 'Delivery all over Nepal', sub: 'District/City/Province Coverage' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:neon-border transition-all">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{item.label}</div>
                      <div className="text-lg font-black uppercase italic">{item.value}</div>
                      <div className="text-xs text-white/40 font-mono italic">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 glass-card rounded-3xl border border-white/5 space-y-6">
              <div className="flex items-center gap-4 text-white/40">
                <MessageSquare size={20} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Live Integration</h4>
              </div>
              <p className="text-xs text-white/40 font-mono leading-relaxed italic">
                Our support systems are integrated directly with Discord and Telegram. Join the elite performance network for real-time consultation.
              </p>
              <button className="w-full py-4 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all italic">
                Connect via Discord
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 relative">
            {formState === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
              >
                <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center">
                  <Send className="text-white animate-bounce" size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold uppercase italic">Message Transmitted</h3>
                  <p className="text-white/40 text-sm font-mono uppercase tracking-widest">Response queue: priority alpha</p>
                </div>
                <button 
                  onClick={() => setFormState('idle')}
                  className="px-8 py-3 text-[10px] font-black underline uppercase tracking-widest"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                   <h3 className="text-2xl font-bold uppercase italic">Initialize Request</h3>
                   <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Fill out the matrix below to start communication.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">IDENTIFIER</label>
                    <input 
                      required
                      type="text" 
                      placeholder="FULL NAME"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-sm focus:outline-none focus:border-white transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">CHANNEL</label>
                    <input 
                      required
                      type="email" 
                      placeholder="EMAIL@DOMAIN.COM"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-sm focus:outline-none focus:border-white transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">SUBJECT</label>
                  <select className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-sm focus:outline-none focus:border-white transition-all font-mono appearance-none uppercase italic font-bold">
                    <option className="bg-black">Technical Inquiry</option>
                    <option className="bg-black">Order Support</option>
                    <option className="bg-black">Partnership</option>
                    <option className="bg-black">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">PAYLOAD</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="MESSAGE CONTENT..."
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-sm focus:outline-none focus:border-white transition-all font-mono resize-none"
                  ></textarea>
                </div>

                <button 
                  disabled={formState === 'sending'}
                  className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-black hover:text-white border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                  {formState === 'sending' ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
