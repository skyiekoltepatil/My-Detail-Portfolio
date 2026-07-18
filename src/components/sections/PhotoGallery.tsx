import { motion } from 'framer-motion';
import innovateImage from '../../assets/INNOVATE-image.jpeg';

const PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    alt: 'Gym',
    rotation: '-rotate-6',
    translateY: 'translate-y-4',
    hoverText: 'Create'
  },
  {
    url: innovateImage,
    alt: 'Coding',
    rotation: 'rotate-3',
    translateY: '-translate-y-2',
    hoverText: 'Innovate'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1473&auto=format&fit=crop',
    alt: 'Sunset',
    rotation: '-rotate-2',
    translateY: '-translate-y-6',
    hoverText: 'Inspire'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1471&auto=format&fit=crop',
    alt: 'Nature',
    rotation: 'rotate-6',
    translateY: '-translate-y-2',
    hoverText: 'Collaborate'
  },
  {
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1470&auto=format&fit=crop',
    alt: 'Portrait',
    rotation: '-rotate-3',
    translateY: 'translate-y-4',
    hoverText: 'Grow'
  }
];

export const PhotoGallery = () => {
  return (
    <section className="py-10 relative z-20 w-full overflow-hidden flex justify-center items-center px-4">
      <div className="flex justify-center items-center gap-3 sm:gap-6 md:gap-8 w-full max-w-[1600px]">
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`group relative flex-1 max-w-[150px] sm:max-w-[200px] md:max-w-[260px] lg:max-w-[300px] aspect-[2/3] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border-[4px] md:border-[6px] border-white/50 bg-white cursor-pointer ${photo.rotation} ${photo.translateY} hover:!rotate-0 hover:!translate-y-0 hover:scale-110 hover:z-30 transition-all duration-500`}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <span className="text-white font-bold text-xs sm:text-base md:text-xl lg:text-2xl tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {photo.hoverText}
              </span>
            </div>
            <img
              src={photo.url}
              alt={photo.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
