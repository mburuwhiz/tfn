import { motion } from 'framer-motion';
import { Rocket, Shield, Clock, Users, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpeedTest from '@/client/components/SpeedTest';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* High-Impact Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white py-20">
        {/* Background Animated Gradient / Graphics */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-primary/40 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center gap-16 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left space-y-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              <Zap size={14} fill="currentColor" /> Ultra-Fast Connectivity
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-tight text-slate-900 tracking-tighter">
              The Next <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Generation</span> of Fibre
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-medium">
              Experience symmetrical speeds up to 1Gbps. Reliability, low latency, and 24/7 support for your digital life.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link to="/plans" className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-3">
                CHOOSE A PLAN <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center">
                CHECK COVERAGE
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full max-w-2xl"
          >
            <SpeedTest />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Rocket />, title: "Hyper Speed", desc: "Up to 1Gbps symmetrical fibre speed for seamless streaming." },
            { icon: <Shield />, title: "Secure Data", desc: "Enterprise-grade security built into every connection." },
            { icon: <Clock />, title: "24/7 Support", desc: "Our dedicated support team is always ready to help." },
            { icon: <Users />, title: "Community", desc: "Join thousands of happy users on our network." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Compact Top Plans Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black">Popular Fibre Plans</h2>
            <p className="text-slate-500 text-lg">Choose the perfect plan for your home or business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Standard", speed: "15 Mbps", price: "2,500", features: ["Unlimited Data", "Free Installation", "Single Device"] },
              { title: "Premium", speed: "50 Mbps", price: "5,000", features: ["Unlimited Data", "Free Installation", "Multi-Device Support", "24/7 Support"], featured: true },
              { title: "Ultra", speed: "100 Mbps", price: "8,500", features: ["Unlimited Data", "Free Router", "Priority Support", "Public IP"] }
            ].map((plan, idx) => (
              <div key={idx} className={`p-10 rounded-3xl border ${plan.featured ? 'border-primary bg-primary/5 ring-4 ring-primary/10 scale-105' : 'border-slate-200 bg-white'} space-y-8 relative overflow-hidden`}>
                {plan.featured && <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Best Value</div>}
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-500 uppercase tracking-widest">{plan.title}</h4>
                  <div className="text-5xl font-black">{plan.speed}</div>
                </div>
                <div className="text-3xl font-black">KES {plan.price}<span className="text-sm font-medium text-slate-500">/mo</span></div>
                <ul className="space-y-4 text-left">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/contact" 
                  className={`block w-full py-4 rounded-xl font-bold transition-all text-center ${plan.featured ? 'bg-primary text-white hover:bg-secondary' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  Select Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
