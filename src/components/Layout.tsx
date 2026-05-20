import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col selection:bg-white selection:text-black">
      <Navbar />
      <main className="flex-grow pt-20">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8 }}
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
