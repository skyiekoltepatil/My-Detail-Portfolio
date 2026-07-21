import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import githubImage from '../../assets/github-image.jpeg';
import LogoLoop from '../../components/effects/LogoLoop';
import { GitHubCalendar } from 'react-github-calendar';
import { Users, BookOpen, Star, GitFork, MapPin, Mail, Building2 } from 'lucide-react';
import { getTodayCommits } from '../../utils/github';
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

export const About = () => {
  const [profile, setProfile] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [realtimeCommits, setRealtimeCommits] = useState(0);
  const username = "skyiekoltepatil";

  useEffect(() => {
    // Fetch profile
    fetch(`https://api.github.com/users/${username}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));

    // Fetch repos
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const excludedRepos = [
            "Login-Interface",
            "learningJs-2025",
            "learning-react-JS-2025",
            "Data-Structures-Algorithmns-main"
          ];
          const filteredRepos = data.filter(repo => !excludedRepos.includes(repo.name));
          setRepos(filteredRepos.slice(0, 6));
        }
      })
      .catch(err => console.error(err));

    // Fetch real-time today commits
    getTodayCommits(username).then(commits => {
      setRealtimeCommits(commits);
    });
  }, [username]);

  const transformCalendarData = (data: Array<any>) => {
    if (realtimeCommits === 0) return data;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayIndex = data.findIndex(d => d.date === todayStr);

    if (todayIndex !== -1) {
      // If the API is lagging behind the real-time events, update it
      if (data[todayIndex].count < realtimeCommits) {
        data[todayIndex].count = realtimeCommits;
        data[todayIndex].level = realtimeCommits >= 10 ? 4 : realtimeCommits >= 5 ? 3 : realtimeCommits >= 2 ? 2 : 1;
      }
    }
    return data;
  };

  return (
    <section className="pt-32 pb-24 relative z-10 bg-white/40 min-h-screen flex flex-col items-center font-sans">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-10"
        >
          {/* Left Sidebar (GitHub Profile Style) */}
          <div className="w-full lg:w-1/4 flex flex-col gap-5">
            <div className="relative group w-[260px] max-w-full mx-auto lg:mx-0">
              <img
                src={githubImage}
                alt="Bhushan Kolte"
                className="w-full aspect-square object-cover rounded-full border border-slate-200 shadow-sm z-10 relative bg-white"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-black leading-tight">Bhushan Kolte</h1>
              <h2 className="text-xl font-light text-slate-500">{username}</h2>
            </div>

            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center py-1.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
            >
              Follow
            </a>

            <p className="text-slate-700 text-sm leading-relaxed">
              {profile?.bio || "Artificial Intelligence & Data Science Student at Alard University | Creative Developer"}
            </p>

            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Users size={16} />
              <span className="font-bold text-slate-800">{profile?.followers || 0}</span> followers <span className="mx-0.5">·</span>
              <span className="font-bold text-slate-800">{profile?.following || 0}</span> following
            </div>

            <div className="flex flex-col gap-2.5 text-sm text-slate-700 border-t border-slate-200 pt-5 mt-1">
              <div className="flex items-center gap-2"><Building2 size={16} className="text-slate-400" /> <span className="font-medium">Alard University</span></div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> Pune, India</div>
              <div className="flex items-center gap-2"><Mail size={16} className="text-slate-400" /> <a href="mailto:bhushankolte20@gmail.com" className="hover:text-blue-600 transition-colors">bhushankolte20@gmail.com</a></div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="w-full lg:w-3/4 flex flex-col gap-8">

            {/* README Section */}
            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                {username} / README.md
              </div>
              <div className="p-8 text-slate-800 text-lg leading-relaxed font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                <div className="space-y-6">
                  <p>
                    Hi, I'm <strong>Bhushan Kolte</strong>, an AI &amp; Data Science student and aspiring developer from India.
                  </p>
                  <p>
                    I'm passionate about web development, artificial intelligence, and creating interactive digital experiences. I enjoy building modern, visually appealing, and performance-driven projects using the latest technologies. I'm constantly learning new tools and improving my problem-solving skills through hands-on development.
                  </p>
                  <p>
                    Beyond coding, I have a strong interest in UI/UX design, gaming, and sports. I believe in continuous growth, experimenting with new ideas, and turning creativity into meaningful projects. My goal is to build innovative products that combine technology, design, and functionality while learning something new every day.
                  </p>
                </div>


                {/* Logo loop embedded in README */}
                <div className="mt-12 pt-8 border-t border-slate-200/50">
                  <p className="text-xs font-sans font-bold text-slate-400 mb-6 uppercase tracking-widest text-center">
                    Technologies I Work With
                  </p>
                  <div style={{ height: '60px', position: 'relative', fontFamily: "sans-serif" }}>
                    <LogoLoop logos={allLogos} speed={45} direction="left" logoHeight={36} gap={40} scaleOnHover />
                  </div>
                </div>
              </div>
            </div>

            {/* Pinned Repos */}
            <div>
              <h3 className="text-base font-normal text-slate-800 mb-4">Pinned</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.length > 0 ? repos.slice(0, 6).map((repo: any) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col p-4 rounded-md border border-slate-200 hover:border-slate-300 transition-colors bg-white group h-32 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={16} className="text-slate-500" />
                      <h4 className="font-semibold text-blue-600 group-hover:underline truncate">{repo.name}</h4>
                      <span className="ml-auto text-xs font-medium text-slate-500 border border-slate-200 rounded-full px-2 py-0.5">Public</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-4 line-clamp-2">{repo.description || "No description provided."}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-auto">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          {repo.language}
                        </div>
                      )}
                      <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <Star size={14} />
                        {repo.stargazers_count}
                      </div>
                      <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <GitFork size={14} />
                        {repo.forks_count}
                      </div>
                    </div>
                  </a>
                )) : (
                  [1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-32 bg-slate-50 rounded-md animate-pulse border border-slate-200 shadow-sm"></div>
                  ))
                )}
              </div>
            </div>

            {/* Contributions */}
            <div className="mt-4">
              <div className="border border-slate-200 rounded-lg bg-white p-6 overflow-x-auto shadow-sm">
                <div className="min-w-[700px] flex justify-center items-center">
                  <GitHubCalendar
                    username={username}
                    year={new Date().getFullYear()}
                    colorScheme="light"
                    transformData={transformCalendarData}
                  />
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
