import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Target, Medal, Brain, Swords, Gamepad, Gamepad2, Users, CheckCircle2, Play, Pause } from 'lucide-react';
import dotaVideo from '../assets/Dota 2 Info.mp4';

const sportsList = ["Badminton", "Cricket", "Basketball", "Table Tennis", "Volleyball", "Swimming", "Relay Race", "100m Sprint"];
const representations = [
  "Represented my school in Cricket tournaments.",
  "Represented my school in Volleyball competitions.",
  "Competed in official Relay Race events."
];
const sportsLearnings = [
  "Leadership under pressure.",
  "Team coordination and communication.",
  "Strategic decision-making.",
  "Competitive mindset and consistency.",
  "Mental resilience and sportsmanship."
];
const compGames = ["Dota 2 (Main Game)", "Valorant", "Counter-Strike 2", "PUBG", "Among Us"];
const storyGames = ["God of War", "GTA V", "Hitman", "Resident Evil", "Borderlands 2", "It Takes Two", "Phasmophobia"];
const genres = ["MOBA", "FPS", "Survival Horror", "RPG", "Open World", "Co-op Adventures", "Strategy Games", "Indie Titles"];
const gamingLearnings = [
  "Strategic thinking and quick decision-making.",
  "Teamplay and communication.",
  "Learning complex game mechanics.",
  "Competitive mindset and adaptability.",
  "Appreciation for storytelling, design, and immersive experiences."
];

export const Hobbies = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section id="hobbies" className="py-24 md:py-32 relative z-10 flex flex-col items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">

        {/* HEADER */}
        <div className="text-center mb-24">

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-900"
          >
            Beyond the <span className="text-gradient">Screen</span>
          </motion.h2>
        </div>

        {/* ======================= SPORTS & ATHLETICS ======================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-4xl font-extrabold text-slate-800 border-b-4 border-orange-400 inline-block pb-2 mb-16">
            Sports & Athletics
          </h3>
        </motion.div>

        {/* Cricket Block (Image Left, Text Right) */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 group">
              <img
                src="/@fs/Users/anakolte/.gemini/antigravity-ide/brain/654d7a30-8aa7-4dd2-a528-6538ae759e55/sport_cricket_1784252298188.png"
                alt="Cricket"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h4 className="text-3xl font-bold text-slate-900">Cricket</h4>
            <div className="text-slate-600 text-lg leading-relaxed font-medium space-y-3">
              <p>Cricket is more than just a game to me; it's a test of patience, strategy, and explosive skill.</p>
              <p>Standing at the crease, every delivery is a mind game against the bowler, requiring complete focus.</p>
              <p>Hitting a perfectly timed cover drive provides a sense of immense satisfaction that is hard to replicate.</p>
              <p>It has taught me the value of teamwork, as eleven players must move in absolute synchrony on the field.</p>
              <p>The sport fundamentally built my competitive drive and mental resilience from a very young age.</p>
            </div>
          </motion.div>
        </div>

        {/* Badminton Block (Text Left, Image Right) */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h4 className="text-3xl font-bold text-slate-900">Badminton</h4>
            <div className="text-slate-600 text-lg leading-relaxed font-medium space-y-3">
              <p>Badminton requires lightning-fast reflexes, intense agility, and split-second decision making.</p>
              <p>The sheer speed of a powerful jump smash is exhilarating, demanding physical power and precision.</p>
              <p>Covering the court efficiently has taught me about anticipation and maintaining high energy levels.</p>
              <p>It's an incredibly fast-paced sport where momentum can shift completely in the blink of an eye.</p>
              <p>Playing badminton keeps my mind sharp, my reflexes tested, and my cardiovascular endurance high.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 group">
              <img
                src="/@fs/Users/anakolte/.gemini/antigravity-ide/brain/654d7a30-8aa7-4dd2-a528-6538ae759e55/sport_badminton_1784252308360.png"
                alt="Badminton"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>

        {/* ======================= SPORTS SUMMARY ======================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-slate-200 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-orange-400/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10">
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium mb-12 max-w-4xl">
              I thrive in competitive environments—whether it's on the court, on the field, or at the starting line. Sports have shaped my discipline, teamwork, adaptability, and mindset. Winning is great, but I've always enjoyed pushing my limits and learning through competition.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h4 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6"><Target size={24} className="text-orange-500" /> All Sports</h4>
                <div className="flex flex-wrap gap-2">
                  {sportsList.map(sport => (
                    <span key={sport} className="px-3 py-1.5 bg-white text-slate-700 rounded-lg text-base font-semibold border border-slate-200 shadow-sm">
                      {sport}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6"><Medal size={24} className="text-orange-500" /> Official Representation</h4>
                <ul className="space-y-4">
                  {representations.map((rep, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-base">
                      <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" /> {rep}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6"><Brain size={24} className="text-orange-500" /> What Sports Taught Me</h4>
                <ul className="space-y-4">
                  {sportsLearnings.map((learning, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-base">
                      <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" /> {learning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>


        {/* ======================= GAMING ======================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 pt-16 border-t border-slate-200/60"
        >
          <h3 className="text-4xl font-extrabold text-slate-800 border-b-4 border-indigo-500 inline-block pb-2 mb-16">
            Gaming
          </h3>
        </motion.div>

        {/* Dota 2 Block (Image Left, Text Right) */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 group h-full">
              <video
                ref={videoRef}
                src={dotaVideo}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                loop
                playsInline
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setProgress((videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100);
                  }
                }}
              />
              <img
                src="/@fs/Users/anakolte/.gemini/antigravity-ide/brain/654d7a30-8aa7-4dd2-a528-6538ae759e55/game_dota2_1784252319174.png"
                alt="Dota 2"
                className={`relative w-full aspect-[4/3] object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'} group-hover:scale-105 z-0`}
              />

              {/* Play/Pause Button Overlay */}
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 z-20 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button
                  onClick={() => {
                    if (isPlaying) {
                      videoRef.current?.pause();
                      setIsPlaying(false);
                    } else {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();
                      }
                      setIsPlaying(true);
                    }
                  }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all shadow-xl"
                >
                  {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
                </button>
              </div>

              {/* Video Progress Scrubber */}
              {isPlaying && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-6 bg-transparent cursor-pointer z-30 flex flex-col justify-end group/scrubber"
                  onClick={(e) => {
                    if (!videoRef.current || !videoRef.current.duration) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newTime = (clickX / rect.width) * videoRef.current.duration;
                    videoRef.current.currentTime = newTime;
                  }}
                >
                  <div className="w-full h-1.5 bg-black/40 group-hover/scrubber:h-2.5 transition-all relative">
                    <div
                      className="h-full bg-indigo-500 relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover/scrubber:opacity-100 transform translate-x-1/2 shadow-md" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h4 className="text-3xl font-bold text-slate-900">Dota 2</h4>
            <div className="text-slate-600 text-lg leading-relaxed font-medium space-y-3">
              <p>Dota 2 is the ultimate test of strategic depth, teamwork, and demanding mechanical mastery.</p>
              <p>Every match is a complex puzzle with infinite variables, requiring deep game knowledge.</p>
              <p>Coordinating with five players to execute flawless team fights provides an unmatched adrenaline rush.</p>
              <p>The game has deeply sharpened my analytical skills and high-stakes decision making.</p>
              <p>It is my absolute main competitive outlet where I continuously push to adapt and improve.</p>
            </div>
          </motion.div>
        </div>

        {/* Phasmophobia Block (Text Left, Image Right) */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h4 className="text-3xl font-bold text-slate-900">Phasmophobia</h4>
            <div className="text-slate-600 text-lg leading-relaxed font-medium space-y-3">
              <p>Phasmophobia offers a highly immersive atmospheric experience focused on suspense and investigation.</p>
              <p>Walking through haunted corridors armed with nothing but a flashlight is genuinely terrifying.</p>
              <p>It relies heavily on communication and teamwork to gather evidence while managing sanity.</p>
              <p>The game perfectly balances sheer horror with methodical, clue-based puzzle-solving mechanics.</p>
              <p>It's my absolute favorite game for thrilling, unforgettable, and chaotic co-op sessions with friends.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 group">
              <img
                src="/@fs/Users/anakolte/.gemini/antigravity-ide/brain/654d7a30-8aa7-4dd2-a528-6538ae759e55/game_phasmophobia_1784252329213.png"
                alt="Phasmophobia"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>

        {/* ======================= GAMING SUMMARY ======================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 mb-12 glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-slate-200 shadow-xl"
        >
          <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-indigo-400/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10">
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium mb-12 max-w-4xl">
              Gaming is more than entertainment for me—it's where I developed problem-solving skills, strategic thinking, and an obsession with mastering mechanics. From highly competitive multiplayer titles to cinematic single-player experiences, I enjoy exploring different genres and challenges.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <h4 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6"><Swords size={24} className="text-indigo-500" /> Competitive Games</h4>
                <div className="flex flex-col gap-3">
                  {compGames.map(game => (
                    <span key={game} className="text-slate-600 text-base font-medium">
                      • {game}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6"><Gamepad size={24} className="text-indigo-500" /> Story & Adventure</h4>
                <div className="flex flex-col gap-3">
                  {storyGames.map(game => (
                    <span key={game} className="text-slate-600 text-base font-medium">
                      • {game}
                    </span>
                  ))}
                  <span className="text-slate-400 text-sm italic mt-2">And Many More...</span>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6"><Gamepad2 size={24} className="text-indigo-500" /> Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <span key={genre} className="px-3 py-1.5 bg-white text-slate-600 rounded-lg text-sm font-semibold border border-slate-200 shadow-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6"><Users size={24} className="text-indigo-500" /> Why I Love Gaming</h4>
                <ul className="space-y-4">
                  {gamingLearnings.map((learning, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-base">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-2" /> {learning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ======================= ANIME SECTION ======================= */}
        <div className="mt-32 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel mb-8 border border-red-500/20 shadow-lg shadow-red-500/10"
          >
            <span className="text-xl">🌸</span>
            <span className="text-sm font-bold text-red-600 uppercase tracking-widest">Anime Enthusiast</span>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight"
          >
            Exploring <span className="text-red-500">Different Worlds</span>
          </motion.h3>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex gap-4 items-center"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 group w-1/2">
              <img
                src="/src/assets/tanjiro-images.png"
                alt="Tanjiro Kamado"
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 group w-1/2">
              <img
                src="/src/assets/nezuko-image.png"
                alt="Nezuko Kamado"
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h4 className="text-3xl font-bold text-slate-900">Demon Slayer</h4>
            <div className="text-slate-600 text-lg leading-relaxed font-medium space-y-3">
              <p>I'm a passionate anime enthusiast who loves exploring different worlds and stories.</p>
              <p>My favorite character is Tanjiro Kamado for his determination, kindness, and never-give-up attitude.</p>
              <p>Demon Slayer is one of the anime that inspired me the most.</p>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50 group">
              <img
                src="/src/assets/spyxfamily-image.png"
                alt="Spy x Family"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h4 className="text-3xl font-bold text-slate-900">Favorite Watches</h4>
            <div className="text-slate-600 text-lg leading-relaxed font-medium space-y-3">
              <p>I've watched Death Note and loved its psychological battles and brilliant storytelling.</p>
              <p>Jujutsu Kaisen impressed me with its action and powerful characters.</p>
              <p>Spy × Family became one of my favorites for its perfect blend of comedy and emotion.</p>
              <p>I enjoyed the humor and overpowered moments in One Punch Man.</p>
              <p>Chainsaw Man kept me hooked with its unique and chaotic world.</p>
              <p>I've also watched many other amazing anime across different genres. Anime continues to inspire my creativity, imagination, and passion for storytelling.</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
