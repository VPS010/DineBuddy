import React from "react";
import { motion } from "framer-motion";
import { QrCode, Clock, Star, Wallet } from "lucide-react";

const SectionWrapper = ({ children, bgColor, id }) => (
  <section id={id} className={`py-20 px-4 ${bgColor}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

export const FeaturesSection = () => {
  const features = [
    {
      icon: <QrCode className="text-green-800" />,
      title: "Instant Order Start",
      desc: "Guests scan & order in 30 seconds - 70% faster than traditional menus",
    },
    {
      icon: <Clock className="text-green-800" />,
      title: "Live Order Symphony",
      desc: "Live updates from kitchen to table reduce cook time errors by 45%",
    },
    {
      icon: <Star className="text-green-800" />,
      title: "Dynamic Menu Engine",
      desc: "Update specials instantly across all tables - sell 30% more high-margin items",
    },
    {
      icon: <Wallet className="text-green-800" />,
      title: "Frictionless Payments",
      desc: "Split bills & pay in 1 tap - 62% fewer payment-related staff calls",
    },
  ];

  return (
    <SectionWrapper bgColor="bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Why Choose <span className="text-gold">DineBuddy?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamlined solutions for modern dining experiences
          </p>
          <div className="mt-8 h-1 w-24 bg-gold mx-auto" />
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-xl bg-white border border-gray-200 hover:border-gold/30 transition-all shadow-sm hover:shadow-md">
                {/* Icon Container */}
                <div className="w-16 h-16 mb-6 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
                  {React.cloneElement(feature.icon, {
                    size: 32,
                    className: "text-green-800",
                  })}
                </div>

                <h3 className="text-2xl font-semibold text-green-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>

                {/* Subtle Hover Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-green-800 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
