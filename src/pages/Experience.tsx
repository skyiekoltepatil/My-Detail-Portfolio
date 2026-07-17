import { motion } from 'framer-motion';
import { ExternalLink, BookOpen } from 'lucide-react';

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.3 6-1.5 6-6.76 0-1.4-.5-2.6-1.4-3.5.1-.3.6-1.7-.1-3.5 0 0-1-.3-3.3 1.2a11.3 11.3 0 0 0-6 0C6 2.7 5 3 5 3c-.7 1.8-.2 3.2-.1 3.5-1 .9-1.5 2.1-1.5 3.5 0 5.2 3 6.5 6 6.8-.7.3-1.3 1-1.5 2.1-.2 0-.8.3-2.3-1-1-.8-1.5-1.5-1.5-1-.2-1.8.2-1.8.2.8.1 1.2 1 1.2 1 .7 1.2 2 1.7 3 1.2 0 1 .1 2.3.1 3" />
  </svg>
);
import Project1Image from '../assets/Project-1-image.png';
import Project2Image from '../assets/Project-2-image.png';
import Project3Image from '../assets/Project-3-image.png';

const EDUCATION = [
  {
    institution: 'Alard University',
    period: '2025-Present',
    description: 'B.Tech in Artificial Intelligence and Data Science.'
  },
  {
    institution: 'Blossom Public School',
    period: '2024 — 2025',
    description: 'Completed 11th & 12th (Science) Successfully completed senior secondary education with a focus on core sciences.'
  }
];

const WORK_EXPERIENCE = [
  {
    role: 'Freelance Front-End Web Designer',
    period: '2025 — Present',
    description: 'Bridging technical functionality with creative design to deliver seamless digital experience'
  }
];

const PROJECTS = [
  {
    title: 'My Detailed Portfolio',
    description: 'A premium, highly interactive React component library for modern web applications.',
    tech: ['React', 'TypeScript', 'Framer Motion', 'Tailwind'],
    image: Project1Image,
    link: 'https://bhushankolte.netlify.app',
    github: 'https://github.com/skyiekoltepatil'
  },
  {
    title: 'Live Portfolio',
    description: 'A modern and interactive portfolio crafted to showcase my passion for technology, creativity, and innovation. Explore my journey, projects, and the ideas that drive me to build meaningful digital experiences.',
    tech: ['HTML', 'CSS', 'JS'],
    image: Project2Image,
    link: 'https://bhushankolte.netlify.app',
    github: 'https://github.com/skyiekoltepatil'
  },
  {
    title: '3D Animated Login Interface',
    description: 'A modern, 3D animated login interface built with React, showcasing interactive elements and fluid CSS animations.',
    tech: ['HTML', 'React JS', 'CSS'],
    image: Project3Image,
    link: 'https://github.com/skyiekoltepatil/Login-Interface',
    github: 'https://github.com/skyiekoltepatil/Login-Interface'
  }
];

export const Experience = () => {
  return (
    <div id="experience" className="py-24 relative z-10">

      {/* Experience Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">My <span className="text-gradient">Experience</span></h2>
        </div>

        <div className="flex flex-col gap-16 max-w-4xl mx-auto">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-50 text-slate-800 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                <BookOpen size={28} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">Education</h3>
            </div>

            <div className="relative pl-8 border-l border-slate-200 ml-8 space-y-12">
              {EDUCATION.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute left-[-44px] top-1.5 w-6 h-6 rounded-full bg-[#e8f1fa] border-4 border-white shadow-sm flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">{item.institution}</h4>
                  <div className="text-blue-700 font-medium text-base mt-2 mb-3">{item.period}</div>
                  <p className="text-slate-600 text-lg leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-50 text-slate-800 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                <BookOpen size={28} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">Experience</h3>
            </div>

            <div className="relative pl-8 border-l border-slate-200 ml-8 space-y-12">
              {WORK_EXPERIENCE.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute left-[-44px] top-1.5 w-6 h-6 rounded-full bg-[#e8f1fa] border-4 border-white shadow-sm flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">{item.role}</h4>
                  <div className="text-blue-700 font-medium text-base mt-2 mb-3">{item.period}</div>
                  <p className="text-slate-600 text-lg leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">Selected <span className="text-gradient">Work</span></h2>
        </div>

        <div className="space-y-32">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-20 items-center`}
            >
              <div className="w-full md:w-3/5">
                <div className="relative rounded-[2.5rem] overflow-hidden group border border-slate-200 shadow-2xl shadow-slate-300/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-[450px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <a href={project.link} className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                      <ExternalLink size={24} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/5 space-y-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t, j) => (
                    <span key={j} className="text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full glass-panel text-slate-700 border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-slate-900">{project.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">{project.description}</p>

                <div className="pt-8 flex items-center gap-8">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-slate-700 hover:text-blue-600 transition-colors">
                    <GithubIcon size={20} /> GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
