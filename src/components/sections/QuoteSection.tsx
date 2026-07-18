import { motion } from 'framer-motion';

export const QuoteSection = () => {
  return (
    <section id="quote-section" className="py-24 md:py-32 relative z-10 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 text-center relative z-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900"
          >
            <span className="text-gradient">Quote</span>
          </motion.h2>
        </div>

        <div className="flex flex-col gap-24 md:gap-40 w-full max-w-5xl mx-auto">
          {/* Max Verstappen Quote - Left Aligned */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative text-left pr-12 md:pr-32"
          >
            <span className="absolute -top-16 -left-8 md:-left-16 text-[8rem] md:text-[12rem] text-slate-900/40 font-serif leading-none select-none z-0 pointer-events-none">
              "
            </span>
            <div className="relative z-10">
              <p className="quote-text text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tight leading-tight mb-8">
                You can sleep while you are dead.
              </p>
              
              <div className="flex items-center justify-start gap-4 mt-8">
                <div className="w-12 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                <p className="text-lg md:text-2xl font-semibold text-slate-600 uppercase tracking-widest">
                  Max Verstappen
                </p>
              </div>
            </div>
          </motion.div>

          {/* Lewis Hamilton Quote - Right Aligned */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative text-right pl-12 md:pl-32"
          >
            <span className="absolute -top-16 -right-8 md:-right-16 text-[8rem] md:text-[12rem] text-slate-900/40 font-serif leading-none select-none z-0 pointer-events-none">
              "
            </span>
            <div className="relative z-10">
              <p className="quote-text text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tight leading-tight mb-8">
                Don't forget who you are mate.
              </p>
              
              <div className="flex items-center justify-end gap-4 mt-8">
                <p className="text-lg md:text-2xl font-semibold text-slate-600 uppercase tracking-widest">
                  Lewis Hamilton
                </p>
                <div className="w-12 h-1 bg-teal-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
