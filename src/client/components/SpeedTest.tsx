import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, Zap, Activity, RefreshCw } from 'lucide-react';

const SpeedTest = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'complete'>('idle');
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [currentTest, setCurrentTest] = useState<'download' | 'upload' | null>(null);
  const [progress, setProgress] = useState(0);

  const startTest = () => {
    setStatus('testing');
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setJitter(0);
    setCurrentTest('download');
    setProgress(0);
  };

  useEffect(() => {
    if (status !== 'testing') return;

    let interval: NodeJS.Timeout;

    if (currentTest === 'download') {
      const targetSpeed = Math.floor(Math.random() * 40) + 60; // 60-100 Mbps
      interval = setInterval(() => {
        setDownloadSpeed(prev => {
          const next = prev + (targetSpeed - prev) * 0.1 + (Math.random() * 5 - 2.5);
          return Math.max(0, parseFloat(next.toFixed(2)));
        });
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setCurrentTest('upload');
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    } else if (currentTest === 'upload') {
      const targetSpeed = Math.floor(Math.random() * 20) + 30; // 30-50 Mbps
      interval = setInterval(() => {
        setUploadSpeed(prev => {
          const next = prev + (targetSpeed - prev) * 0.1 + (Math.random() * 3 - 1.5);
          return Math.max(0, parseFloat(next.toFixed(2)));
        });
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('complete');
            setCurrentTest(null);
            setPing(Math.floor(Math.random() * 15) + 5);
            setJitter(Math.floor(Math.random() * 5) + 1);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [status, currentTest]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[48px] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      
      <div className="relative z-10 space-y-12">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Speed Test</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} className="text-primary" /> Real-time Simulation
            </p>
          </div>
          {status === 'complete' && (
            <button 
              onClick={startTest}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all group"
            >
              <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          )}
        </div>

        <div className="flex justify-center relative py-8">
          <svg className="w-72 h-72 transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            <motion.circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              className="text-primary"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center transform rotate-0">
            <AnimatePresence mode="wait">
              {status === 'idle' ? (
                <motion.button
                  key="start"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={startTest}
                  className="w-32 h-32 bg-primary text-white rounded-full font-black text-xl shadow-xl shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center"
                >
                  START
                </motion.button>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <div className="text-6xl font-black text-slate-900 tracking-tighter">
                    {currentTest === 'download' ? downloadSpeed.toFixed(1) : 
                     currentTest === 'upload' ? uploadSpeed.toFixed(1) : 
                     downloadSpeed.toFixed(1)}
                  </div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mbps</div>
                  <div className="text-xs font-black text-primary uppercase mt-2">
                    {currentTest === 'download' ? 'Testing Download...' : 
                     currentTest === 'upload' ? 'Testing Upload...' : 
                     'Test Complete'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className={`p-6 rounded-[32px] border transition-all duration-500 ${currentTest === 'download' ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-slate-50 border-transparent'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentTest === 'download' ? 'bg-primary text-white' : 'bg-white text-slate-400'}`}>
                <Download size={18} />
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Download</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{downloadSpeed.toFixed(1)} <span className="text-xs font-bold text-slate-400">Mbps</span></div>
          </div>

          <div className={`p-6 rounded-[32px] border transition-all duration-500 ${currentTest === 'upload' ? 'bg-secondary/5 border-secondary shadow-lg shadow-secondary/5' : 'bg-slate-50 border-transparent'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentTest === 'upload' ? 'bg-secondary text-white' : 'bg-white text-slate-400'}`}>
                <Upload size={18} />
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{uploadSpeed.toFixed(1)} <span className="text-xs font-bold text-slate-400">Mbps</span></div>
          </div>
        </div>

        {status === 'complete' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100"
          >
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ping</span>
              <span className="text-lg font-black text-slate-900">{ping} <span className="text-[10px] font-bold text-slate-400">ms</span></span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jitter</span>
              <span className="text-lg font-black text-slate-900">{jitter} <span className="text-[10px] font-bold text-slate-400">ms</span></span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpeedTest;