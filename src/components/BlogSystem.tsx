/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Compass, BookOpen, User, Calendar, MessageSquare, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Blog } from '../types';
import { CURATED_BLOGS } from '../data';

export default function BlogSystem() {
  const [blogs, setBlogs] = useState<Blog[]>(CURATED_BLOGS);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Comment input form variables
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  const categories = ['all', 'Luxury Travel', 'Cultural Guides', 'Adventure'];

  const loadBlogsOnServer = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
        if (selectedBlog) {
          const updated = data.find((b: Blog) => b.id === selectedBlog.id);
          if (updated) setSelectedBlog(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBlogsOnServer();
  }, []);

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog || !commentText.trim()) return;

    setCommenting(true);
    try {
      const response = await fetch(`/api/blogs/${selectedBlog.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentName.trim() || 'Anonymous Explorer',
          text: commentText.trim()
        })
      });

      if (response.ok) {
        setCommentName('');
        setCommentText('');
        await loadBlogsOnServer();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCommenting(false);
    }
  };

  // Filtered lists logic
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in font-normal text-slate-200">
      
      {/* Detail overlay page */}
      {selectedBlog ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedBlog(null)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curations</span>
          </button>

          <article className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            {/* Banner image covers */}
            <div className="h-80 relative">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <span className="px-2.5 py-1 bg-sky-505 bg-sky-550 bg-sky-500 rounded text-[10px] font-mono whitespace-nowrap uppercase font-bold text-white">
                  {selectedBlog.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug font-display pt-1">
                  {selectedBlog.title}
                </h1>
              </div>
            </div>

            {/* Meta headers */}
            <div className="px-6 sm:px-8 py-5 border-b border-white/5 bg-white/5 flex flex-wrap items-center justify-between text-xs text-slate-350 text-slate-300 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-indigo-650 bg-indigo-505 bg-indigo-500 text-white font-bold rounded-full flex items-center justify-center">
                  {selectedBlog.author.charAt(0)}
                </div>
                <span className="font-semibold text-white">{selectedBlog.author}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400" /> {selectedBlog.date}</span>
                <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px] font-mono">{selectedBlog.readTime}</span>
              </div>
            </div>

            {/* Read body */}
            <div className="px-6 sm:px-8 py-8 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              <p className="whitespace-pre-line leading-relaxed">{selectedBlog.content}</p>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {selectedBlog.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full font-medium border border-indigo-500/10 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments Thread list panels */}
            <div className="p-6 sm:p-8 border-t border-white/10 bg-white/5 space-y-6">
              <h3 className="text-md font-bold text-white flex items-center gap-1.5 font-display">
                <MessageSquare className="w-5 h-5 text-indigo-400" /> Comments ({selectedBlog.comments.length})
              </h3>

              {selectedBlog.comments.length > 0 ? (
                <div className="space-y-4">
                  {selectedBlog.comments.map(c => (
                    <div key={c.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-white">{c.author}</span>
                        <span className="text-[10px] font-mono text-slate-400">{c.date}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{c.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Be the first to add your perspective to this curation.</p>
              )}

              {/* Compose comment form */}
              <form onSubmit={addComment} className="space-y-4 pt-4 border-t border-white/5">
                <span className="block text-xs font-mono tracking-wider uppercase text-slate-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Post your traveler review
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-normal">
                  <input
                    type="text"
                    placeholder="Wanderer Name"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="space-y-1.5 font-normal">
                  <textarea
                    rows={3}
                    placeholder="Write comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-indigo-400 h-20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={commenting}
                  className="px-5 py-2.5 bg-white hover:bg-sky-400 text-slate-950 hover:text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer active-glow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{commenting ? 'Posting...' : 'Post comment'}</span>
                </button>
              </form>
            </div>

          </article>
        </div>
      ) : (
        /* Standard directory list view */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-display">
                <Compass className="w-6 h-6 text-indigo-450 text-indigo-400 animate-spin-slow" /> Expert Travel Curations
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                Explore premium SEO sitemapped travel guides regarding Amalfi beaches, Japanese Ryokan customs, Swiss peaks budgeting and more.
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative font-normal">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tags, places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-405 focus:border-sky-400"
              />
            </div>
          </div>

          {/* Category filter capsule rows */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                  activeCategory === cat
                    ? 'bg-white text-slate-950 active-glow'
                    : 'bg-white/5 border border-white/10 text-slate-305 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat === 'all' ? 'All Guides' : cat}
              </button>
            ))}
          </div>

          {/* Grid listing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-normal">
            {filteredBlogs.map(b => (
              <div
                key={b.id}
                onClick={() => setSelectedBlog(b)}
                className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition cursor-pointer flex flex-col justify-between transform hover:-translate-y-1 group duration-200 focus:outline-none"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-slate-950/80 backdrop-blur rounded text-[9px] font-mono text-white border border-white/5">
                      {b.category}
                    </div>
                  </div>

                  <div className="p-5.5 space-y-2.5">
                    <h3 className="text-sm font-bold text-white line-clamp-2 uppercase group-hover:text-sky-400 transition leading-snug font-display pt-1">
                      {b.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed font-normal">
                      {b.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5.5 pt-0 flex items-center justify-between text-[10px] text-slate-405 text-slate-400 font-mono border-t border-white/5">
                  <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-slate-450" /> {b.author}</span>
                  <span>{b.readTime}</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
