import { motion, useScroll, useTransform } from 'framer-motion';
import workingGif from '../../assets/workinggif.mp4';
import RotatingText from '../../components/effects/RotatingText';

export const Home = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-start justify-start z-10 overflow-hidden -mt-24 pt-24"
    >
      {/* Background Video — fills the entire hero section */}
      <div className="absolute inset-0 z-0">
        <video
          src={workingGif}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Main content on top */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-4xl px-4 md:px-8 w-full text-left flex flex-col items-start mt-4 pointer-events-none"
      >
        <h1 className="text-[2.75rem] leading-[1.1] sm:text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter sm:leading-[1.05] mb-8 text-[#5C1A1B] drop-shadow-sm">
          <span className="block">Creative</span>
          <span className="block">
            <RotatingText
              texts={['UI Designer.', 'Thinker.', 'Coder.', 'Developer.', 'Problem Solver.']}
              mainClassName="text-[#5C1A1B] inline-flex"
              staggerFrom="last"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-1 md:pb-2"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2500}
            />
          </span>
        </h1>
      </motion.div>
    </section>
  );
};

