import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { MagneticElement } from './effects/Shared';
import { saveMessageToDatabase } from '../services/contactDatabase';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('sending');

    try {
      await saveMessageToDatabase(formData);
    } catch (err) {
      console.error('Contact submission error:', err);
    }

    setStatus('sent');
    setFormData({ name: '', email: '', message: '' });

    // Revert back to idle after 4 seconds
    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Form</h3>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            required
            disabled={status === 'sending'}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm disabled:opacity-70"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            disabled={status === 'sending'}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm disabled:opacity-70"
          />
        </div>

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={5}
          required
          disabled={status === 'sending'}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-700 placeholder:text-slate-400 resize-none shadow-sm disabled:opacity-70"
        ></textarea>

        <div className="flex justify-end mt-2">
          <MagneticElement>
              <button
                type="submit"
                disabled={status !== 'idle'}
                className={`flex items-center gap-3 px-8 py-4 border shadow-sm rounded-2xl transition-all duration-300 group min-w-[210px] justify-center ${
                  status === 'idle'
                    ? 'bg-white border-slate-200 hover:shadow-md hover:-translate-y-1 hover:border-blue-200 cursor-pointer'
                    : status === 'sending'
                    ? 'bg-blue-50 border-blue-200 text-blue-600 cursor-wait'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                }`}
              >
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <Send size={18} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                      <span className="font-bold text-slate-600 group-hover:text-blue-600 transition-colors text-[15px]">
                        Send Message
                      </span>
                    </motion.div>
                  )}

                  {status === 'sending' && (
                    <motion.div
                      key="sending"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <Loader2 size={18} className="text-blue-600 animate-spin" />
                      <span className="font-bold text-blue-600 text-[15px]">
                        Sending...
                      </span>
                    </motion.div>
                  )}

                  {status === 'sent' && (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span className="font-bold text-emerald-700 text-[15px]">
                        Message has been sent
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </MagneticElement>
        </div>
      </form>
    </div>
  );
};
