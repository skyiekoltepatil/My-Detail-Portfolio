import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section id="contact-section" className="py-24 md:py-32 relative z-10 flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-10 bg-white p-6 sm:p-10 md:p-14 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200/60"
        >
          <div className="w-full text-center mb-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Get in Touch</h2>
            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">I'm currently available for freelance work and open to new opportunities. Let's create something amazing together!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {/* Email Card */}
            <a
              href="mailto:bhushankolte20@gmail.com"
              className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-lg hover:-translate-y-1 transition-all group text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-blue-200 group-hover:text-blue-600 transition-all duration-300">
                <Mail size={32} className="text-slate-700 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Me</h3>
              <p className="text-slate-600 font-medium group-hover:text-blue-700 transition-colors">Send a message</p>
            </a>

            {/* Phone Card */}
            <a
              href="tel:+918421361302"
              className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-green-200 hover:bg-green-50/50 hover:shadow-lg hover:-translate-y-1 transition-all group text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-green-200 group-hover:text-green-600 transition-all duration-300">
                <Phone size={32} className="text-slate-700 group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Call Me</h3>
              <p className="text-slate-600 font-medium group-hover:text-green-700 transition-colors">Give me a ring</p>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
