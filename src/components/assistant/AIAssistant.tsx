import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '../../services/aiService';
import { Laugh, BriefcaseBusiness, Layers, UserRoundSearch, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import FluidCursor from '../FluidCursor';
import AllProjects from '../projects/AllProjects';
import { ContactForm } from '../ContactForm';
import myAvatar from '../../assets/my-avatar.png';

const quickQuestions = [
  { key: 'Me', color: '#329696', icon: Laugh, text: 'Who are you? I want to know more about you.' },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness, text: 'What are your projects?' },
  { key: 'Skills', color: '#856ED9', icon: Layers, text: 'What are your skills?' },
  { key: 'Contact', color: '#C19433', icon: UserRoundSearch, text: 'How can I reach you?' },
];

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isWidget?: boolean;
  widgetType?: string;
}

export const AIAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isExpanded) {
      setTimeout(scrollToBottom, 100);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [messages, isExpanded, isLoading, showQuickQuestions]);

  const submitMessage = async (textToSubmit: string) => {
    if (!textToSubmit.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: textToSubmit };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setShowQuickQuestions(false);

    try {
      const history = newMessages.map(msg => ({ role: msg.sender, content: msg.text })) as any;
      let aiResponseText = await getAIResponse(history);
      
      let isWidget = false;
      let widgetType = '';
      
      if (aiResponseText.includes('[WIDGET:PROJECTS]')) {
        isWidget = true;
        widgetType = 'PROJECTS';
        aiResponseText = aiResponseText.replace('[WIDGET:PROJECTS]', '').trim();
      } else if (aiResponseText.includes('[WIDGET:CONTACT]')) {
        isWidget = true;
        widgetType = 'CONTACT';
        aiResponseText = aiResponseText.replace('[WIDGET:CONTACT]', '').trim();
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        isWidget,
        widgetType
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Oops! Something went wrong.';
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'ai', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(inputValue);
  };

  const isEmptyState = messages.length === 0;

  return (
    <>
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform"
          >
            <span className="text-white font-bold text-2xl tracking-tight">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl pointer-events-auto"
              onClick={() => setIsExpanded(false)}
            />

            {/* Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-5xl h-full max-h-[85vh] bg-[#F9FAFB] rounded-3xl shadow-2xl relative pointer-events-auto flex flex-col overflow-hidden"
            >
              {/* Wavy Background (For Landing State) */}
              {isEmptyState && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                   <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/70 via-white/20 to-transparent blur-[80px]"></div>
                   <div className="absolute top-[20%] right-[-20%] w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/60 via-transparent to-transparent blur-[80px]"></div>
                   <div className="absolute bottom-[-10%] left-[20%] w-[100%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50/70 via-transparent to-transparent blur-[100px]"></div>
                   <FluidCursor />
                   {/* Large Bhushan Watermark */}
                   <div className="absolute bottom-0 w-full flex justify-center overflow-hidden">
                     <div className="text-[10rem] md:text-[14rem] font-black text-gray-900/5 select-none leading-none mb-[-2rem] md:mb-[-4rem]">
                       Bhushan
                     </div>
                   </div>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200/50 p-3 pb-3 relative z-10 bg-white/60 backdrop-blur-md">
                <div className="flex items-center gap-1.5 pl-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 flex items-center justify-center group border border-[#E0443E]"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[#4C0000] text-[8px] font-bold mt-[1px]">✕</span>
                  </button>
                  <button className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 border border-[#DEA123]" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} />
                  <button className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 border border-[#1AAB29]" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <span className="text-gray-900 font-bold text-lg leading-none">AI</span>
                  <span className="font-semibold text-sm text-gray-900">Personal Assistant</span>
                </div>
                <div className="w-12"></div>
              </div>

              {isEmptyState ? (
                // Landing State UI
                <div className="flex-1 flex flex-col items-center justify-center relative z-20 px-4 w-full max-w-4xl mx-auto overflow-y-auto pb-4">
                  <div className="flex flex-col items-center text-center mt-6">
                    <h2 className="text-gray-600 mt-1 text-lg font-semibold md:text-xl">
                      Hey, I'm Bhushan 👋
                    </h2>
                    <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-gray-900 tracking-tight mt-2 px-4">
                      VIBE CODER
                    </h1>
                  </div>
                  
                  <div className="relative h-48 w-48 sm:h-64 sm:w-64 mt-4 mb-4 flex items-center justify-center pointer-events-none">
                     <img 
                        src={myAvatar} 
                        alt="Hero memoji" 
                        className="w-full h-full object-cover scale-[1.1] translate-y-2 drop-shadow-xl"
                     />
                  </div>
                  
                  <div className="w-full max-w-3xl mx-auto mt-6 pb-8">
                     <form
                       onSubmit={(e) => {
                         e.preventDefault();
                         submitMessage(inputValue);
                       }}
                       className="relative w-full max-w-xl mx-auto"
                     >
                       <div className="flex items-center rounded-full border border-gray-200/60 bg-white/80 py-2.5 pr-2 pl-6 backdrop-blur-xl transition-all shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20">
                         <input
                           type="text"
                           value={inputValue}
                           onChange={(e) => setInputValue(e.target.value)}
                           disabled={isLoading}
                           placeholder="Ask me anything…"
                           className="w-full border-none bg-transparent text-base text-gray-900 placeholder:text-gray-500 focus:outline-none"
                         />
                         <button
                           type="submit"
                           disabled={!inputValue.trim() || isLoading}
                           className="flex items-center justify-center rounded-full bg-[#0171E3] p-2.5 text-white transition-colors hover:bg-blue-600 disabled:opacity-50 shadow-sm"
                         >
                           <ArrowUp className="h-5 w-5" />
                         </button>
                       </div>
                     </form>
                     
                     <div className="mt-10 grid w-full grid-cols-2 sm:grid-cols-4 gap-4">
                       {quickQuestions.map(({ key, color, icon: Icon, text }) => (
                         <button
                           key={key}
                           onClick={() => submitMessage(text)}
                           disabled={isLoading}
                           className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-gray-200/50 bg-white/70 py-8 shadow-sm backdrop-blur-xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all disabled:opacity-50 active:scale-95"
                         >
                           <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100">
                             <Icon size={24} strokeWidth={2.5} color={color} />
                           </div>
                           <span className="text-sm font-semibold text-gray-700">{key}</span>
                         </button>
                       ))}
                     </div>
                  </div>
                </div>
              ) : (
                // Chat State UI (Redesigned based on screenshot)
                <div className="flex-1 flex flex-col bg-white overflow-hidden relative z-20">
                  <div className="flex-1 overflow-y-auto py-8 px-4 sm:px-8 space-y-12 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-12">
                      {/* Avatar at the very top of all text, acts as Home Button */}
                      <div className="w-full flex justify-center animate-in fade-in slide-in-from-top-4 duration-500">
                        <button 
                          onClick={() => setMessages([])}
                          className="group relative focus:outline-none flex flex-col items-center"
                          title="Return to Home"
                        >
                          <img 
                            src={myAvatar} 
                            alt="AI Avatar" 
                            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-lg group-hover:scale-105 group-active:scale-95 transition-transform duration-300" 
                          />
                          <span className="text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                            Go back home
                          </span>
                        </button>
                      </div>

                      {messages.map((msg, idx) => {
                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                        const parts = msg.text ? msg.text.split(urlRegex) : [];

                        return msg.sender === 'ai' ? (
                          <div key={msg.id} className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Widget Area */}
                            {msg.isWidget && msg.widgetType === 'PROJECTS' && (
                              <div className="w-full mb-8 flex flex-col items-start">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">My Projects</h2>
                                <div className="w-full -mx-4 sm:mx-0 sm:w-full overflow-hidden">
                                  <AllProjects />
                                </div>
                              </div>
                            )}

                            {msg.isWidget && msg.widgetType === 'CONTACT' && (
                              <div className="w-full mb-8 flex flex-col bg-white rounded-[2rem] p-6 sm:p-10 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] max-w-2xl mx-auto">
                                <ContactForm />
                                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
                                   <span className="text-gray-500 font-medium">Or email me directly at:</span>
                                   <a href="mailto:bhushankolte20@gmail.com" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors text-lg">bhushankolte20@gmail.com</a>
                                </div>
                              </div>
                            )}
                            
                            {/* Plain Text Area */}
                            {msg.text && (
                              <div className="text-gray-800 text-base sm:text-lg leading-relaxed text-left w-full max-w-4xl">
                                {parts.map((part, i) => {
                                  if (part.match(urlRegex)) {
                                    const cleanUrl = part.replace(/[).,\]!?]+$/, '');
                                    const punctuation = part.slice(cleanUrl.length);
                                    return (
                                      <span key={i}>
                                        <a href={cleanUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-medium hover:text-blue-600 underline underline-offset-4">
                                          {cleanUrl}
                                        </a>
                                        {punctuation}
                                      </span>
                                    );
                                  }
                                  return <span key={i}>{part}</span>;
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div key={msg.id} className="flex justify-end w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="bg-[#0171E3] text-white px-5 py-3.5 rounded-3xl rounded-tr-md text-base sm:text-lg max-w-[85%] shadow-sm leading-relaxed">
                               {msg.text}
                             </div>
                          </div>
                        );
                      })}
                      
                      {isLoading && (
                        <div className="flex flex-col items-center w-full animate-in fade-in duration-300">
                           <div className="flex gap-2 items-center text-gray-400">
                             <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                             <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                             <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                           </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Redesigned Bottom Input Area matching the screenshot */}
                  <div className="px-4 pb-6 pt-2 bg-white relative z-20 flex flex-col items-center border-t border-transparent shadow-[0_-10px_40px_rgba(255,255,255,1)]">
                    <button
                      onClick={() => setShowQuickQuestions(!showQuickQuestions)}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors mb-4 mt-2"
                    >
                      {showQuickQuestions ? (
                        <><ChevronDown className="w-3.5 h-3.5" /> Hide quick questions</>
                      ) : (
                        <><ChevronUp className="w-3.5 h-3.5" /> Show quick questions</>
                      )}
                    </button>

                    <AnimatePresence>
                      {showQuickQuestions && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0, translateY: 10 }}
                          animate={{ height: 'auto', opacity: 1, translateY: 0 }}
                          exit={{ height: 0, opacity: 0, translateY: 10 }}
                          className="flex flex-wrap justify-center gap-3 mb-6 w-full max-w-3xl"
                        >
                          {quickQuestions.map(({ key, color, icon: Icon, text }) => (
                            <button
                              key={key}
                              type="button"
                              disabled={isLoading}
                              onClick={() => submitMessage(text)}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                            >
                              <Icon size={18} color={color} strokeWidth={2.5} />
                              <span className="text-sm font-semibold text-gray-700">{key}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSendMessage} className="relative w-full max-w-3xl mx-auto">
                      <div className="mx-auto flex items-center rounded-full bg-[#F2F2F7] py-2 pr-2 pl-6 transition-all focus-within:ring-2 focus-within:ring-[#96A8D6]/30">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          disabled={isLoading}
                          placeholder="Ask me anything"
                          className="w-full border-none bg-transparent text-gray-900 text-base placeholder-gray-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim() || isLoading}
                          className="flex items-center justify-center rounded-full bg-[#96A8D6] p-2.5 text-white disabled:opacity-50 transition-colors hover:bg-[#8598c7]"
                        >
                          <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
