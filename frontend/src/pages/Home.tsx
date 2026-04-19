import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-cyan opacity-20" />
        <div className="container relative z-10 flex flex-col items-center text-center gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Experience Ultra-Fast Fibre
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl"
          >
            Reliable, premium connectivity for your home and business. Get connected with TWOEM FIBRE NETWORK today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-4 mt-4"
          >
            <Button size="lg" className="bg-brand-magenta hover:bg-brand-magenta/90 text-white" asChild>
              <Link to="/plans">View Plans</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-black border-white hover:bg-white/10 hover:text-white" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Top Plans Section */}
      <section className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Packages</h2>
          <p className="text-slate-500 mt-2">Choose the perfect speed for your needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Mock Plans for Home Page */}
          {[
            { name: "Starter Fibre", speed: "50 Mbps", price: 49, features: ["Unlimited Data", "Free Router", "24/7 Support"] },
            { name: "Family Fibre", speed: "100 Mbps", price: 79, features: ["Unlimited Data", "Free Router", "24/7 Support", "Symmetrical Speeds"], isPopular: true },
            { name: "Pro Fibre", speed: "500 Mbps", price: 129, features: ["Unlimited Data", "Premium Router", "Priority Support", "Symmetrical Speeds"] }
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full flex flex-col relative ${plan.isPopular ? 'border-brand-blue shadow-lg scale-105 z-10' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-slate-900">{plan.speed}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">${plan.price}</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-magenta" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'} asChild>
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
