import { motion } from 'framer-motion';
import aboutImage from '../../assets/image-1.png';
import LogoLoop from '../effects/LogoLoop';

import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiVite, SiNodedotjs, SiPython, SiPostgresql,
  SiFirebase, SiFigma,
  SiGooglegemini, SiOllama, SiAnthropic, SiVercel, SiGithub,
  SiKaggle,
} from 'react-icons/si';
import { FaLinkedin, FaFileExcel, FaChartBar } from 'react-icons/fa';

const allLogos = [
  { node: <SiReact style={{ color: '#61DAFB' }} />, title: 'React', href: 'https://react.dev/' },
  { node: <SiNextdotjs style={{ color: '#111827' }} />, title: 'Next.js', href: 'https://nextjs.org/' },
  { node: <SiTypescript style={{ color: '#3178C6' }} />, title: 'TypeScript', href: 'https://www.typescriptlang.org/' },
  { node: <SiTailwindcss style={{ color: '#06B6D4' }} />, title: 'Tailwind CSS', href: 'https://tailwindcss.com/' },
  { node: <SiVite style={{ color: '#646CFF' }} />, title: 'Vite', href: 'https://vitejs.dev/' },
  { node: <SiNodedotjs style={{ color: '#339933' }} />, title: 'Node.js', href: 'https://nodejs.org/' },
  { node: <SiFirebase style={{ color: '#F5A623' }} />, title: 'Firebase', href: 'https://firebase.google.com/' },
  { node: <SiFigma style={{ color: '#F24E1E' }} />, title: 'Figma', href: 'https://www.figma.com/' },
  { node: <SiVercel style={{ color: '#111827' }} />, title: 'Vercel', href: 'https://vercel.com/' },
  { node: <SiGithub style={{ color: '#181717' }} />, title: 'GitHub', href: 'https://github.com/' },
  { node: <FaLinkedin style={{ color: '#0A66C2' }} />, title: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { node: <SiGooglegemini style={{ color: '#886FBF' }} />, title: 'Gemini', href: 'https://gemini.google.com/' },
  { node: <SiAnthropic style={{ color: '#D4A27F' }} />, title: 'Claude', href: 'https://claude.ai/' },
  { node: <SiOllama style={{ color: '#111827' }} />, title: 'Ollama', href: 'https://ollama.com/' },
  { node: <SiPython style={{ color: '#3776AB' }} />, title: 'Python', href: 'https://www.python.org/' },
  { node: <SiKaggle style={{ color: '#20BEFF' }} />, title: 'Kaggle', href: 'https://www.kaggle.com/' },
  { node: <SiPostgresql style={{ color: '#4169E1' }} />, title: 'PostgreSQL', href: 'https://www.postgresql.org/' },
  { node: <FaFileExcel style={{ color: '#217346' }} />, title: 'Excel', href: 'https://www.microsoft.com/en-us/microsoft-365/excel' },
  { node: <FaChartBar style={{ color: '#F2C811' }} />, title: 'Power BI', href: 'https://powerbi.microsoft.com/' },
];

export const AboutSection = () => {
  return (
    <section id="about-me" className="py-24 relative z-10 bg-white/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">About <span className="text-gradient">Me</span></h2>
        </div>
        <div className="flex flex-col md:flex-row gap-16 items-start">
          <div className="w-full md:w-1/2">
            <div className="rounded-[2.5rem] overflow-hidden group">
              <motion.img
                src={aboutImage}
                alt="About Me"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 text-slate-800 text-xl leading-relaxed font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            <div className="space-y-6">
              <p>
                Hi, I'm <strong>Bhushan Kolte</strong>, an Artificial Intelligence and Data Science student at Alard University, Pune, driven by a passion for technology and innovation. I am constantly exploring new ideas, building technical skills, and challenging myself to grow both personally and professionally. My focus is on crafting modern web experiences that perfectly balance sleek visual design with seamless functionality. I add a highly personalized touch to your portfolios and websites to communicate your unique brand identity in the most creative way possible. As an active freelancer, I collaborate with clients to bring their next big vision to life.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack Logo Loop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 pt-10 border-t border-slate-200/50"
        >
          <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest text-center">
            Technologies I Work With
          </p>
          <div style={{ height: '80px', position: 'relative' }}>
            <LogoLoop
              logos={allLogos}
              speed={90}
              direction="left"
              logoHeight={44}
              gap={56}
              scaleOnHover
              ariaLabel="Technology stack"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
