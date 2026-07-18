import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, MapPin, Send } from 'lucide-react';
import AvatarImage from '../../assets/Avatar-1-image.png';
import { MagneticElement } from '../../components/effects/Shared';

export const Contact = () => {
  const GithubIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  );

  const LinkedinIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );

  return (
    <section id="contact" className="py-24 md:py-32 relative z-10 flex flex-col items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-8 w-full"
        >
          {/* Left Sidebar Profile Card */}
          <div className="w-full lg:w-1/3 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 flex flex-col items-center">
            {/* Avatar */}
            <div className="w-32 h-32 bg-blue-100 rounded-3xl mb-6 flex items-center justify-center shadow-inner border border-blue-200 overflow-hidden">
              <img src={AvatarImage} alt="Bhushan Kolte" className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bhushan Kolte</h2>
            <div className="px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg mb-8">
              Creative Developer
            </div>
            
            <div className="w-full h-px bg-slate-100 mb-8"></div>
            
            <div className="flex flex-col gap-6 w-full mb-8">
              {/* Email */}
              <a href="mailto:bhushankolte20@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors shadow-sm">
                  <Mail size={20} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-0.5">EMAIL</p>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Send a message</p>
                </div>
              </a>
              
              {/* Phone */}
              <a href="tel:+918421361302" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-green-50 group-hover:border-green-200 transition-colors shadow-sm">
                  <Phone size={20} className="text-slate-500 group-hover:text-green-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-0.5">PHONE</p>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-green-600 transition-colors">Give me a ring</p>
                </div>
              </a>

              {/* Birthday */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar size={20} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-0.5">BIRTHDAY</p>
                  <p className="text-sm font-semibold text-slate-700">13 febuary 2008</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                  <MapPin size={20} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-0.5">LOCATION</p>
                  <p className="text-sm font-semibold text-slate-700 leading-tight">Pune, Maharashtra,<br/>India</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-auto pt-4">
              <a href="https://github.com/skyiekoltepatil" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-800 transition-colors">
                <GithubIcon size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <LinkedinIcon size={20} />
              </a>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="w-full lg:w-2/3 bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/60">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">Contact</h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full mb-8"></div>
            
            {/* Map Section */}
            <div className="w-full h-[250px] md:h-[350px] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 mb-10 shadow-sm relative group">
              <iframe 
                src="https://maps.google.com/maps?q=Pune,+Maharashtra&t=&z=11&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter contrast-[0.95]"
              ></iframe>
            </div>

            {/* Contact Form Section */}
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Form</h3>
            
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Full name" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
                />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
                />
              </div>
              
              <textarea 
                placeholder="Your Message" 
                rows={5}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-700 placeholder:text-slate-400 resize-none shadow-sm"
              ></textarea>

              <div className="flex justify-end mt-2">
                <MagneticElement>
                  <button type="submit" className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md hover:-translate-y-1 hover:border-blue-200 transition-all group">
                    <Send size={18} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                    <span className="font-bold text-slate-600 group-hover:text-blue-600 transition-colors text-[15px]">Send Message</span>
                  </button>
                </MagneticElement>
              </div>
            </form>
          </div>

        </motion.div>
      </div>
    </section>
  );
};
