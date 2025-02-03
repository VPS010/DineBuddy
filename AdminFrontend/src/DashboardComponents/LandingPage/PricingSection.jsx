import { motion } from "framer-motion";
import { Sparkles, CheckCircle } from "lucide-react";

const SectionWrapper = ({ children, bgColor, id }) => (
  <section id={id} className={`py-20 px-4 ${bgColor}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

export const PricingSection = () => {
  const plans = [
    {
      title: "Basic",
      price: 2999,
      features: [
        "Basic Analytics",
        "Email Support",
        "QR Menu System",
      ],
      popular: false,
    },
    {
      title: "Professional",
      price: 4999,
      features: [
        "Advanced Analytics",
        "Priority Support",
        "Custom Branding",
        "Promotion Tools",
      ],
      popular: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      features: [
        "Dedicated Support",
        "API Access",
        "Custom Integrations",
        "Multi-location",
      ],
      popular: false,
    },
  ];

  return (
    <SectionWrapper bgColor="bg-metallic/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-deep-green">
          Simple, Affordable Pricing
        </h2>
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-center mt-8 mb-12"
        >
          <button className="bg-maroon text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2 mx-auto">
            <Sparkles className="w-20 h-20 md:w-6 md:h-6" />
            Currently the Site is Still Under Development and only a MVP is
            released, Therefore you can Try all our available Services for Free
          </button>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 px-4">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-xl shadow-lg transition-all duration-300 ${
                plan.popular
                  ? "bg-deep-green text-white border-2 border-gold"
                  : "bg-white border-2 border-transparent"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-deep-green px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold"> ₹{plan.price}</span>
                {typeof plan.price === "number" && (
                  <span className="text-gray-500">/month</span>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        plan.popular ? "text-gold" : "text-deep-green"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`w-full py-3 rounded-lg font-semibold ${
                  plan.popular
                    ? "bg-gold text-deep-green hover:bg-gold/90"
                    : "bg-deep-green text-white hover:bg-deep-green/90"
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
