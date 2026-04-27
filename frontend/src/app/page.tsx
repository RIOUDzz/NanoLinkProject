"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link2, Copy, BarChart3, ArrowRight, ExternalLink, RefreshCw, CheckCircle2, Shield, Zap, Globe, Layers, Server } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

interface URLData {
  shortCode: string;
  original_url: string;
  count?: number;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState<URLData | null>(null);
  const [history, setHistory] = useState<URLData[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    fetchHistory(true);
    const interval = setInterval(() => fetchHistory(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async (showLoading = true) => {
    if (showLoading) setHistoryLoading(true);
    try {
      const urlsRes = await fetch(`${GATEWAY_URL}/api/urls`);
      const urls = await urlsRes.json();
      const statsRes = await fetch(`${GATEWAY_URL}/api/stats`);
      const stats = await statsRes.json();

      const merged = urls.map((u: any) => ({
        shortCode: u.short_code,
        original_url: u.original_url,
        count: stats.find((s: any) => s.shortCode === u.short_code)?.count || 0
      }));
      setHistory(merged);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      if (showLoading) setHistoryLoading(false);
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`${GATEWAY_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setShortened({ ...data, count: 0 });
      setUrl("");
      fetchHistory(false);
    } catch (error) {
      console.error("Shorten failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="glass-bg" />
      <div className="hero-mesh" />
      
      {/* Background Blobs - Optimized with will-change */}
      <motion.div 
        animate={{ 
          x: [0, 80, 0], 
          y: [0, 40, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="blob top-[10%] left-[10%] w-[500px] h-[500px] bg-purple-600/10 will-change-transform" 
      />
      <motion.div 
        animate={{ 
          x: [0, -80, 0], 
          y: [0, -40, 0],
          scale: [1, 1.15, 1] 
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="blob bottom-[10%] right-[10%] w-[600px] h-[600px] bg-blue-600/10 will-change-transform" 
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 backdrop-blur-md bg-black/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image src="/Logo.svg" alt="NanoLink Logo" fill className="object-contain" priority />
            </div>
    
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#shorten" className="hover:text-white transition-colors">Start Shortening</a>
            <a href="https://github.com/RIOUDzz/NanoLinkProject" target="_blank" className="flex items-center space-x-2 text-white bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all">
              <Globe size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="relative pt-20">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="max-w-5xl space-y-8 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex justify-center mb-8"
            >
              <div className="relative w-32 h-32 md:w-48 md:h-48 glass-card p-6 border-white/20 bg-white/5">
                <Image src="/Logo.svg" alt="NanoLink Hero Logo" fill className="object-contain p-4" priority />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              Shorten Links. <br />
              <span className="text-gradient">Track Everything.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-medium"
            >
              A high-performance URL ecosystem built with Node.js, Go, and Python. 
              Distributed architecture, blazing fast redirects, and real-time analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <a href="#shorten" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 flex items-center space-x-2">
                <span>Try it now</span>
                <ArrowRight size={20} />
              </a>
              <a href="#features" className="px-8 py-4 glass-card hover:bg-white/10 text-white rounded-2xl font-bold text-lg flex items-center space-x-2">
                <span>The Tech Stack</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Floating Hero Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[10%] hidden lg:block"
          >
            <div className="glass-card p-6 rotate-12 bg-emerald-500/10 border-emerald-500/20">
              <Zap className="text-emerald-400 w-8 h-8" />
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] left-[10%] hidden lg:block"
          >
            <div className="glass-card p-6 -rotate-12 bg-pink-500/10 border-pink-500/20">
              <BarChart3 className="text-pink-400 w-8 h-8" />
            </div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-32 px-6 bg-black/40 relative">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Engineered for <span className="text-indigo-400">Scale</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto">Three specialized services working in perfect harmony to deliver 99.9% uptime and microsecond latency.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Node.js API", 
                  desc: "Handles URL shortening with Sequelize ORM and event-driven data replication.", 
                  icon: <Layers className="text-indigo-400" />,
                  color: "indigo"
                },
                { 
                  title: "Go Redirector", 
                  desc: "Blazing fast redirects powered by GORM and highly-optimized concurrency.", 
                  icon: <Zap className="text-sky-400" />,
                  color: "sky"
                },
                { 
                  title: "Python Analytics", 
                  desc: "Rich statistics tracking utilizing SQLModel for reliable click-stream monitoring.", 
                  icon: <BarChart3 className="text-pink-400" />,
                  color: "pink"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-10 space-y-6 group"
                >
                  <div className={`p-4 bg-${feature.color}-500/20 rounded-2xl w-fit group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SHORTENER SECTION */}
        <section id="shorten" className="py-40 px-6 relative">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 font-black">Control Center</span></h2>
              <p className="text-gray-500">Paste your link and watch the microservices flow.</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 bg-white/5 border-white/10"
            >
              <form onSubmit={handleShorten} className="space-y-6">
                <div className="relative group">
                  <input
                    type="url"
                    placeholder="https://your-extremely-long-url.com/path..."
                    required
                    className="w-full glass-input px-8 py-5 rounded-2xl text-xl pl-16 font-medium"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Link2 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors w-7 h-7" />
                </div>
                
                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center space-x-3 text-xl uppercase tracking-wider"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin w-7 h-7" />
                  ) : (
                    <>
                      <span>Generate NanoLink</span>
                      <ArrowRight className="w-7 h-7" />
                    </>
                  )}
                </button>
              </form>

              <AnimatePresence>
                {shortened && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-10 pt-10 border-t border-white/10"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-500/20 p-3 rounded-xl">
                          <CheckCircle2 className="text-indigo-400 w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-xs text-indigo-400/80 font-black uppercase tracking-widest">Global NanoLink ready</p>
                          <p className="font-mono text-2xl text-white font-bold tracking-tight">localhost:8080/{shortened.shortCode}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => copyToClipboard(`localhost:8080/${shortened.shortCode}`)}
                          className="flex-1 glass-card px-6 py-4 flex items-center justify-center space-x-2 hover:bg-white/10 font-bold"
                        >
                          {copied ? <span className="text-indigo-400">Copied!</span> : <><Copy size={20}/> <span>Copy Code</span></>}
                        </button>
                        <a 
                          href={`http://localhost:8080/${shortened.shortCode}`} 
                          target="_blank"
                          className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 flex items-center justify-center space-x-2 font-bold"
                        >
                          <ExternalLink size={20}/>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Live Stats Table */}
            <div className="space-y-6 pt-10">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-bold flex items-center space-x-4">
                  <Server className="text-indigo-400 w-8 h-8" />
                  <span>The ClickStream</span>
                </h2>
                <button 
                  onClick={() => fetchHistory()}
                  className="text-gray-500 hover:text-white transition-colors text-sm flex items-center space-x-2 bg-white/5 py-2 px-4 rounded-full border border-white/5"
                >
                  <RefreshCw size={14} className={cn(historyLoading && "animate-spin")} />
                  <span>Sync Nodes</span>
                </button>
              </div>

              <div className="grid gap-6">
                {historyLoading && history.length === 0 ? (
                  [1, 2, 3].map(i => <div key={i} className="h-28 glass-card animate-pulse" />)
                ) : history.length === 0 ? (
                  <div className="text-center py-20 glass-card bg-white/2 opacity-50">
                    <p className="text-xl">Network idle. Awaiting the first link.</p>
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <motion.div
                      key={item.shortCode}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass-card p-8 flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-default"
                    >
                      <div className="space-y-2 overflow-hidden pr-6">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl font-black italic tracking-tighter text-indigo-400">/{item.shortCode}</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-black text-gray-500 border border-white/5 tracking-tighter">Verified Node</span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium truncate max-w-sm">
                          {item.original_url}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-8 shrink-0">
                        <div className="text-right">
                          <p className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">{item.count || 0}</p>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300/50 font-black mt-2">Active Visited</p>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(`localhost:8080/${item.shortCode}`)}
                          className="bg-white/5 p-4 rounded-2xl text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-all border border-white/5 group-hover:border-indigo-500/20"
                        >
                          <Copy size={24} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="py-20 border-t border-white/5 text-center text-gray-600 text-sm font-medium">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <Globe className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Shield className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Layers className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
          <p>© 2026 NanoLink Infrastructure. Distributed under MIT License.</p>
        </footer>
      </main>
    </div>
  );
}
