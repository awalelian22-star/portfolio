import Layout from '../components/Layout';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-20 space-y-6">
          <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold uppercase">
            Legal_Protocols / v2026.01
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8">
            Privacy <br/><span className="text-white/20">Policy</span>
          </h1>
          <p className="text-[11px] uppercase font-bold tracking-[0.3em] text-white/40 leading-relaxed italic">
            DEFINING DATA TRANSMISSION AND STORAGE PARAMETERS FOR THE NEXAMOD PERFORMANCE NETWORK.
          </p>
        </div>

        <div className="glass-card p-12 border-white/5 space-y-16 mb-20">
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-white/20">
              <Eye size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">01. Data Acquisition</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              We collect identification data including name, shipping coordinates, and terminal contact info strictly for the fulfillment of physical module acquisitions. Technical hardware compatibility data may be logged to improve system integration.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 text-white/20">
              <Lock size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">02. Secure Storage</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              All credentials and transition history are stored within encrypted Firebase nodes. We utilize industry-standard cryptographic protocols to ensure the integrity of your rider profile.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 text-white/20">
              <ShieldCheck size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">03. Transmission Safety</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Third-party financial transmission is processed exclusively through the Stripe Secure Gateway. At no point does our system retain raw credit vault credentials.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 text-white/20">
              <FileText size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">04. Protocol Updates</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              NEXAMOD Industries reserves the right to modify these parameters. Continued use of the platform constitutes acceptance of current security protocols.
            </p>
          </section>
        </div>

        <div className="p-8 border border-white/5 text-[9px] uppercase tracking-widest text-white/20 font-mono text-center">
          LAST MODIFICATION DETECTED: MAY 19, 2026 // SYSTEM_TIME_STAMP: 09:00:00
        </div>
      </div>
    </Layout>
  );
}
