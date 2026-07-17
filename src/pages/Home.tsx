import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Download } from 'lucide-react';
import { MagneticElement } from '../components/Shared';

export const Home = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center z-10 overflow-hidden -mt-24 pt-24"
      style={{ backgroundColor: '#ffffff' }}
    >

      {/* Main content on top */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-center md:text-left flex flex-col items-center md:items-start pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel mb-8 pointer-events-auto"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold text-slate-700">Available for new opportunities</span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[1.05] mb-8 text-slate-900"
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            Creative
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="block text-gradient"
          >
            Web Engineer.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-500 max-w-2xl mb-12 font-medium"
        >
          I craft award-winning digital experiences, bridging the gap between exceptional design and robust engineering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center md:justify-start items-center gap-6 pointer-events-auto"
        >
          <MagneticElement>
            <a
              href="#experience"
              className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-slate-900/20"
            >
              View Work <ChevronRight size={20} />
            </a>
          </MagneticElement>
          <MagneticElement>
            <a
              href="#"
              className="px-8 py-4 rounded-full glass-panel hover:bg-white transition-colors flex items-center gap-2 font-semibold text-slate-700 shadow-sm border border-slate-200"
            >
              <Download size={20} /> Resume
            </a>
          </MagneticElement>
        </motion.div>
      </motion.div>
    </section>
  );
};
