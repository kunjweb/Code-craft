import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Code2, 
  Sparkles, 
  Terminal, 
  Trash2, 
  Github, 
  Plus, 
  MessageSquare, 
  Settings, 
  Layout, 
  PanelLeft,
  ChevronRight,
  Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from './components/ChatMessage';
import { chatWithAI, Message } from './services/geminiService';
import { cn } from './utils';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await chatWithAI(newMessages);
      setMessages([...newMessages, { role: 'model', content: aiResponse }]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-white border-r border-line flex flex-col relative z-20"
      >
        <div className="p-4 flex items-center justify-between border-b border-line h-16">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shrink-0">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight whitespace-nowrap">CodeCraft</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500"
          >
            <PanelLeft size={18} />
          </button>
        </div>

        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          <button 
            onClick={clearChat}
            className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors mb-4"
          >
            <Plus size={16} />
            <span>New Session</span>
          </button>

          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Recent History
          </div>
          
          {messages.length > 0 ? (
            <div className="px-3 py-2 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-600 cursor-default group">
              <MessageSquare size={14} className="shrink-0" />
              <span className="truncate">{messages[0].content}</span>
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-xs text-zinc-400 italic">
              No recent sessions
            </div>
          )}
        </div>

        <div className="p-4 border-t border-line space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg text-sm transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">
                JD
              </div>
              <span className="text-xs font-medium text-zinc-700">Developer</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Pro</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-grid min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-line bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500"
              >
                <PanelLeft size={18} />
              </button>
            )}
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Layout size={16} />
              <ChevronRight size={14} className="text-zinc-300" />
              <span className="font-medium text-zinc-900">Current Session</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-zinc-100 rounded-md border border-zinc-200 text-[10px] font-mono text-zinc-500">
              <Command size={10} />
              <span>K</span>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 bg-white border border-line rounded-3xl flex items-center justify-center shadow-sm relative"
                >
                  <Sparkles className="text-zinc-900 w-10 h-10" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                </motion.div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900">CodeCraft AI</h2>
                  <p className="text-zinc-500 text-lg">
                    Your intelligent partner for writing, debugging, and optimizing code.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {[
                    { title: "Write a React hook", desc: "For handling local storage with sync", icon: Code2 },
                    { title: "Explain closures", desc: "Deep dive into JS scope and memory", icon: Terminal },
                    { title: "Debug Python error", desc: "Fix list comprehension edge cases", icon: Sparkles },
                    { title: "Tailwind Grid", desc: "Modern responsive layout patterns", icon: Layout }
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(item.title)}
                      className="p-5 text-left bg-white border border-line rounded-2xl hover:border-zinc-900 hover:shadow-lg transition-all group relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <item.icon size={18} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                          <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-900 transition-transform group-hover:translate-x-1" />
                        </div>
                        <p className="font-bold text-zinc-900">{item.title}</p>
                        <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 rounded-full -mr-12 -mt-12 group-hover:bg-zinc-100 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-w-4xl mx-auto w-full">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} role={msg.role} content={msg.content} />
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex justify-start mb-6">
                    <div className="bg-white border border-line rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-gradient-to-t from-bg via-bg to-transparent">
            <div className="max-w-4xl mx-auto w-full relative">
              <div className="relative group shadow-2xl rounded-3xl overflow-hidden border border-line bg-white">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message CodeCraft..."
                  className="w-full bg-transparent px-6 py-5 pr-16 focus:outline-none transition-all resize-none min-h-[64px] max-h-[200px] text-zinc-800 placeholder:text-zinc-400"
                  rows={1}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "p-2.5 rounded-2xl transition-all",
                      input.trim() && !isLoading 
                        ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg scale-100" 
                        : "bg-zinc-100 text-zinc-300 cursor-not-allowed scale-95"
                    )}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                  <span>Gemini 3.1 Pro</span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <span>v2.4.0</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">
                  Press <kbd className="px-1 bg-zinc-100 border border-zinc-200 rounded">Enter</kbd> to send
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
