/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, X, Bot, User, Globe2, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Greetings! I am **TravelAI**, your elite luxury tour concierge. ✈️

I am connected to live Google Search intelligence to answer travel questions, suggest dream boutique accommodations, outline custom itineraries, or check current flight and weather conditions.

How may I assist you with your next odyssey?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    '3-day Goa itinerary under ₹80,005',
    'Best honeymoon spots and boutique stays',
    'Things to do in Dubai highlights',
    'Switzerland backpacker checklist'
  ];

  const handleSend = async (textToSend: string) => {
    const userText = textToSend.trim();
    if (!userText) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText
        })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: 'msg-bot-' + Date.now(),
        sender: 'bot',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingUrls: data.groundingUrls
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'bot',
        text: 'Apologies, traveler. My communications link is temporarily fluctuating. Please confirm your API key is correctly configured inside your Secrets portal.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sparkle Action Circle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-indigo-650 bg-indigo-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse border border-white/20 hover:border-white/40 active-glow"
        >
          <MessageSquare className="w-6 h-6 shrink-0" />
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-500 border border-white flex items-center justify-center text-[7px] text-white font-extrabold">
            AI
          </span>
        </button>
      )}

      {/* Floating Panel Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[550px] bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          {/* Top Info Ribbon */}
          <div className="bg-white/5 border-b border-white/5 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">TravelAI Advisor</h4>
                <span className="block text-[10px] text-sky-400 font-mono flex items-center gap-1 font-bold">
                  <Globe2 className="w-3 h-3 animate-spin-slow" /> Grounded under live search
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dialogue list view */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent font-normal">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} items-start space-x-2.5`}>
                  {isBot && (
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-1">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-xs leading-relaxed font-normal ${
                        isBot
                          ? 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-sm shadow-sm'
                          : 'bg-indigo-600/80 border border-indigo-500/20 text-white rounded-tr-sm shadow'
                      }`}
                    >
                      {/* Robust styling supporting newline markdown paragraphs */}
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Display search grounds if available */}
                      {isBot && msg.groundingUrls && msg.groundingUrls.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-white/5 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-450 text-slate-450 block tracking-widest font-bold flex items-center gap-1">
                            <Globe2 className="w-3 h-3 text-sky-450 text-sky-400 animate-pulse" /> Verified Sources:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {msg.groundingUrls.slice(0, 3).map((g, idx) => (
                              <a
                                key={idx}
                                href={g.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-[10px] text-sky-400 hover:underline bg-white/5 px-2 py-0.5 rounded-md border border-white/5 font-mono"
                              >
                                {g.title.slice(0, 20)}...
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="block text-[9px] font-mono text-slate-400 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sky-405 text-sky-400 shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl shadow-sm text-xs text-slate-350 text-slate-300 flex items-center space-x-1.5 font-normal">
                  <span className="animate-ping w-2 h-2 bg-sky-400 rounded-full" />
                  <span>Searching airline logs and hotel rates...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Collapsible quick cue prompts */}
          {messages.length === 1 && (
            <div className="p-3 bg-white/5 border-t border-white/5 space-y-2 font-normal">
              <span className="text-[10px] font-mono tracking-widest text-slate-350 text-slate-300 uppercase font-bold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Frequent exploration guidelines
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp)}
                    className="p-2 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-slate-300 text-left font-medium truncate cursor-pointer"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dialogue Form controls */}
          <div className="p-4 bg-white/5 border-t border-white/5 flex items-center space-x-2 font-normal">
            <input
              type="text"
              placeholder="Ask about cheap flights, hotels..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400 focus:bg-white/10 placeholder-slate-400 transition"
            />
            <button
              onClick={() => handleSend(input)}
              className="p-3 rounded-xl bg-white hover:bg-sky-400 text-slate-950 hover:text-white shadow-md active:scale-95 transition cursor-pointer active-glow"
            >
              <Send className="w-4 h-4 shrink-0" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
