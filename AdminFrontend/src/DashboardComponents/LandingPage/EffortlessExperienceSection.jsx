import React from "react";
import { motion } from "framer-motion";
import { Sparkles, BookUser, Wallet, CheckCircle } from "lucide-react";

const SectionWrapper = ({ children, bgColor, id }) => (
  <section id={id} className={`py-20 px-4 ${bgColor}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

export const EffortlessExperienceSection = () => {
  const steps = [
    {
      icon: <Sparkles className="text-green-800" />,
      title: "Instant Menu Access",
      desc: "Guests browse your offerings the moment they sit down – no waiting, no paper menus",
      benefit: "85% of diners prefer digital menus for quicker decisions*",
      emotionalHook: "Turn arrival moments into anticipation",
    },
    {
      icon: <BookUser className="text-green-800" />,
      title: "Stress-Free Customization",
      desc: "Allergy filters and chef suggestions make personalization effortless",
      benefit: "2.3x more repeat orders with saved preferences",
      emotionalHook: "Every meal feels tailor-made",
    },
    {
      icon: <Wallet className="text-green-800" />,
      title: "One-Tap Freedom",
      desc: "Split bills and pay securely without waiting for staff assistance",
      benefit: "62% faster table turnover during peak hours*",
      emotionalHook: "Leave when ready, not when permitted",
    },
  ];

  return (
    <SectionWrapper bgColor="bg-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            <span className="text-gold">Effortless Enjoyment</span> Your
            Customers Deserve
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create dining experiences so smooth, customers feel like royalty
          </p>
          <div className="mt-6 h-1 w-24 bg-gold mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative"
            >
              <div className="h-full p-8 rounded-xl bg-white border-2 border-transparent hover:border-gold/20 transition-all shadow-lg hover:shadow-xl">
                {/* Comfort Indicator */}
                <div className="absolute top-4 right-4 bg-green-50 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6 text-gold" />
                </div>

                {/* Icon Container */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 rounded-full flex items-center justify-center border-2 border-gold/20">
                  {React.cloneElement(step.icon, {
                    size: 36,
                    className: "text-green-800",
                  })}
                </div>

                <h3 className="text-2xl font-semibold text-green-800 text-center mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">
                  {step.desc}
                </p>
                <div className="h-px bg-gold/20 my-6 w-3/4 mx-auto" />
                <div className="text-center space-y-2">
                  <p className="text-sm text-green-800/80">{step.benefit}</p>
                  <p className="text-gold font-semibold italic">
                    {step.emotionalHook}
                  </p>
                </div>

                {/* Hover Enhancement */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
