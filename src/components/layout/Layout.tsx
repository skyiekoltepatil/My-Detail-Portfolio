import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomCursor, BackgroundEffects } from '../effects/Shared';
// @ts-ignore
import CursorGrid from '../effects/CursorGrid';

const AppleLogo = () => (
  <svg viewBox="0 0 384 512" className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:scale-110 transition-transform" fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Full width black bezel to mimic the MacBook screen edge */}
      <div className="fixed -top-1 left-0 w-full h-3 sm:h-4 bg-black z-40 pointer-events-none" />

      <div className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full pointer-events-none">
        <motion.nav
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          layout
          initial={{ width: 130, height: 32 }}
          animate={{
            width: isHovered ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 380 : 540) : 130,
            height: isHovered ? 48 : 32
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="bg-black rounded-b-[1.25rem] flex items-center justify-between px-6 sm:px-8 pointer-events-auto relative shadow-[0_15px_50px_rgba(0,0,0,0.8)]"
        >
          {/* Left Inverted Curve (SVG) - overlaps by 1px to fix sub-pixel gaps */}
          <svg width="16" height="16" className="absolute top-0 -left-[15px] pointer-events-none fill-black text-black" viewBox="0 0 20 20">
            <path d="M0,0 L20,0 L20,20 A20,20 0 0,0 0,0 Z" />
          </svg>

          {/* Right Inverted Curve (SVG) - overlaps by 1px to fix sub-pixel gaps */}
          <svg width="16" height="16" className="absolute top-0 -right-[15px] pointer-events-none fill-black text-black" viewBox="0 0 20 20">
            <path d="M0,0 L20,0 A20,20 0 0,0 0,20 L0,0 Z" />
          </svg>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.1 } }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-6 sm:gap-8 absolute left-8"
              >
                <div className="relative group">
                  <button className="text-zinc-400 hover:text-white transition-colors text-sm sm:text-[15px] font-medium whitespace-nowrap flex items-center gap-1.5 py-2">
                    About Me
                    <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu - using padding to bridge the hover gap perfectly */}
                  <div className="absolute top-full left-0 pt-4 -mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                    <div className="bg-black/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl py-2 min-w-[160px] flex flex-col transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <Link to="/about" className="block px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl mx-1 transition-colors">About Me</Link>
                      <Link to="/experience" className="block px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl mx-1 transition-colors">My Experience</Link>
                      <Link to="/hobbies" className="block px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl mx-1 transition-colors">Hobbies</Link>
                    </div>
                  </div>
                </div>
                <Link to="/quote" className="text-zinc-400 hover:text-white transition-colors text-sm sm:text-[15px] font-medium whitespace-nowrap">Quote</Link>
              </motion.div>
            )}
          </AnimatePresence>

          <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
            <motion.div layoutId="logo" transition={{ type: "spring", stiffness: 400, damping: 30 }}>
              <AppleLogo />
            </motion.div>
          </Link>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.1 } }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-6 sm:gap-8 absolute right-8"
              >
                <Link to="/fun-games" className="text-zinc-400 hover:text-white transition-colors text-sm sm:text-[15px] font-medium whitespace-nowrap">Fun Games</Link>
                <Link to="/contact" className="text-zinc-400 hover:text-white transition-colors text-sm sm:text-[15px] font-medium whitespace-nowrap">Contact</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </>
  );
};

export const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900 flex flex-col overflow-x-hidden w-full relative">
      <CustomCursor />
      <BackgroundEffects />

      {/* Global Cursor Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CursorGrid
          cellSize={30}
          color="#000000"
          radius={100}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={0.8}
          maxOpacity={0.8}
          fillOpacity={0}
          gridOpacity={0.04}
          cellRadius={2}
          clickPulse
          pulseSpeed={500}
        />
      </div>

      <Navbar />

      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="relative z-10 mt-auto border-t border-slate-200/60 bg-white/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-slate-800 font-bold text-lg tracking-tight">Bhushan Kolte</p>
            <p className="text-slate-500 font-medium text-sm">© {new Date().getFullYear()} All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            Designed with <span className="text-red-500 animate-pulse">❤️</span> in React
          </div>
        </div>
      </footer>
    </div>
  );
};
