import Layout from '../components/Layout';
import { AlertTriangle, Cpu, Globe, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <Layout>
      <div className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-20 space-y-6">
          <div className="inline-block px-3 py-1 border border-white text-[10px] tracking-widest font-bold uppercase">
            Legal_Protocols / v2026.01
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8">
            Terms of <br/><span className="text-white/20">Service</span>
          </h1>
          <p className="text-[11px] uppercase font-bold tracking-[0.3em] text-white/40 leading-relaxed italic">
            OPERATIONAL AGREEMENT FOR HARDWARE ACQUISITION AND COMPONENT INSTALLATION.
          </p>
        </div>

        <div className="glass-card p-12 border-white/5 space-y-16 mb-20">
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-white/20">
              <Globe size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">01. Global Access</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              By accessing the NEXAMOD network, you agree to comply with all local, state, and international regulations regarding motorcycle performance modifications.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 text-white/20">
              <Cpu size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">02. Technical Compliance</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              NEXAMOD provides technical hardware modules "AS IS". Users are responsible for ensuring hardware/software compatibility with their specific motorcycle terminal before initiating installation protocols.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 text-white/20">
              <AlertTriangle size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">03. Risk Acknowledgement</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Performance modifications can void factory warranties and alter vehicle behavior. NEXAMOD Industries assumes zero liability for system failures or mechanical incidents post-installation.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 text-white/20">
              <Scale size={20} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">04. Commercial Terms</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              All transactions are final once the module leaves the dispatch facility. Warranty claims are restricted to identified manufacturing defects within the initial 30-day calibration period.
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
