import { motion } from 'framer-motion';
import aboutImage from '../assets/image-1.png';
import LogoLoop from '../components/LogoLoop';
import ScrambledText from '../components/ScrambledText';
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiVite, SiNodedotjs, SiPython, SiPostgresql,
  SiFirebase, SiFigma,
  SiGooglegemini, SiOllama, SiAnthropic, SiVercel, SiGithub,
  SiJupyter, SiPandas, SiNumpy, SiScikitlearn, SiTensorflow,
  SiKaggle, SiOpencv, SiPlotly, SiStreamlit, SiGooglecolab, SiR,
} from 'react-icons/si';
import { FaLinkedin, FaMicrosoft } from 'react-icons/fa';

const allLogos = [
  { node: <SiReact style={{ color: '#61DAFB' }} />, title: 'React' },
  { node: <SiNextdotjs style={{ color: '#111827' }} />, title: 'Next.js' },
  { node: <SiTypescript style={{ color: '#3178C6' }} />, title: 'TypeScript' },
  { node: <SiTailwindcss style={{ color: '#06B6D4' }} />, title: 'Tailwind CSS' },
  { node: <SiVite style={{ color: '#646CFF' }} />, title: 'Vite' },
  { node: <SiNodedotjs style={{ color: '#339933' }} />, title: 'Node.js' },
  { node: <SiFirebase style={{ color: '#F5A623' }} />, title: 'Firebase' },
  { node: <SiFigma style={{ color: '#F24E1E' }} />, title: 'Figma' },
  { node: <SiVercel style={{ color: '#111827' }} />, title: 'Vercel' },
  { node: <SiGithub style={{ color: '#181717' }} />, title: 'GitHub' },
  { node: <FaLinkedin style={{ color: '#0A66C2' }} />, title: 'LinkedIn' },
  { node: <SiGooglegemini style={{ color: '#886FBF' }} />, title: 'Gemini' },
  { node: <SiAnthropic style={{ color: '#D4A27F' }} />, title: 'Claude' },
  { node: <SiOllama style={{ color: '#111827' }} />, title: 'Ollama' },
  { node: <SiPython style={{ color: '#3776AB' }} />, title: 'Python' },
  { node: <SiR style={{ color: '#276DC3' }} />, title: 'R' },
  { node: <SiJupyter style={{ color: '#F37626' }} />, title: 'Jupyter' },
  { node: <SiGooglecolab style={{ color: '#F9AB00' }} />, title: 'Google Colab' },
  { node: <SiPandas style={{ color: '#150458' }} />, title: 'Pandas' },
  { node: <SiNumpy style={{ color: '#013243' }} />, title: 'NumPy' },
  { node: <SiScikitlearn style={{ color: '#F7931E' }} />, title: 'Scikit-learn' },
  { node: <SiTensorflow style={{ color: '#FF6F00' }} />, title: 'TensorFlow' },
  { node: <SiOpencv style={{ color: '#5C3EE8' }} />, title: 'OpenCV' },
  { node: <SiPlotly style={{ color: '#3F4F75' }} />, title: 'Plotly' },
  { node: <SiStreamlit style={{ color: '#FF4B4B' }} />, title: 'Streamlit' },
  { node: <SiKaggle style={{ color: '#20BEFF' }} />, title: 'Kaggle' },
  { node: <SiPostgresql style={{ color: '#4169E1' }} />, title: 'PostgreSQL' },
  { node: <FaMicrosoft style={{ color: '#5E5E5E' }} />, title: 'Power BI / Excel' },
];

export const About = () => {
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
            <ScrambledText className="space-y-6" radius={100} duration={1.2} speed={0.5} scrambleChars="0123456789!@#%&*ABCDEFGHIJKLMNOPQRSTUVWXYZ">
              <p>
                Hi, I'm <strong>Bhushan Kolte</strong>, an Artificial Intelligence and Data Science student at Alard University, Pune, driven by a passion for technology and innovation. I am constantly exploring new ideas, building technical skills, and challenging myself to grow both personally and professionally. My focus is on crafting modern web experiences that perfectly balance sleek visual design with seamless functionality. I add a highly personalized touch to your portfolios and websites to communicate your unique brand identity in the most creative way possible. As an active freelancer, I collaborate with clients to bring their next big vision to life.
              </p>
            </ScrambledText>
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
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#f8fafc"
              ariaLabel="Technology stack"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
