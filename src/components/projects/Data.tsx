
import { ChevronRight, Link } from 'lucide-react';
import project1Img from '../../assets/Project-1-image.png';
import project2Img from '../../assets/Project-2-image.png';
import project3Img from '../../assets/Project-3-image.png';

export interface ProjectProps {
  title: string;
  description?: string;
  techStack?: string[];
  date?: string;
  links?: { name: string; url: string }[];
  images?: { src: string; alt: string }[];
}

const PROJECT_CONTENT: ProjectProps[] = [
  {
    title: 'My Detailed Portfolio',
    description: 'A premium, highly interactive React component library for modern web applications.',
    techStack: ['React', 'TypeScript', 'Framer Motion', 'Tailwind'],
    date: '2025',
    links: [
      { name: 'Website', url: 'https://bhushankolte.netlify.app' },
      { name: 'GitHub', url: 'https://github.com/skyiekoltepatil' }
    ],
    images: []
  },
  {
    title: 'Live Portfolio',
    description: 'A modern and interactive portfolio crafted to showcase my passion for technology, creativity, and innovation. Explore my journey, projects, and the ideas that drive me to build meaningful digital experiences.',
    techStack: ['HTML', 'CSS', 'JS'],
    date: '2024',
    links: [
      { name: 'Website', url: 'https://bhushankolte.netlify.app' },
      { name: 'GitHub', url: 'https://github.com/skyiekoltepatil' }
    ],
    images: []
  },
  {
    title: '3D Animated Login Interface',
    description: 'A modern, 3D animated login interface built with React, showcasing interactive elements and fluid CSS animations.',
    techStack: ['HTML', 'React JS', 'CSS'],
    date: '2024',
    links: [
      { name: 'GitHub', url: 'https://github.com/skyiekoltepatil/Login-Interface' }
    ],
    images: []
  }
];


const ProjectContent = ({ project }: { project: ProjectProps }) => {
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      <div className="rounded-3xl bg-[#F5F5F7] p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{projectData.date}</span>
          </div>
          <p className="text-gray-900 font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>
          {projectData.techStack && projectData.techStack.length > 0 && (
            <div className="pt-4">
              <h3 className="mb-3 text-sm tracking-wide text-gray-500 uppercase">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectData.techStack?.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-gray-500">
              Links
            </h3>
            <Link className="text-gray-500 w-4 h-4" />
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="space-y-3">
            {projectData.links?.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7]"
              >
                <span className="font-light capitalize text-gray-900">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-gray-900" />
              </a>
            ))}
          </div>
        </div>
      )}

      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images?.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover transition-transform w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const data = [
  { category: 'Web Development', title: 'My Detailed Portfolio', src: project1Img, content: <ProjectContent project={{ title: 'My Detailed Portfolio' }} /> },
  { category: 'Web Development', title: 'Live Portfolio', src: project2Img, content: <ProjectContent project={{ title: 'Live Portfolio' }} /> },
  { category: 'UI/UX', title: '3D Animated Login Interface', src: project3Img, content: <ProjectContent project={{ title: '3D Animated Login Interface' }} /> }
];
