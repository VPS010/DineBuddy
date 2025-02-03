import { motion } from "framer-motion";

const SectionWrapper = ({ children, bgColor, id }) => (
  <section id={id} className={`py-20 px-4 ${bgColor}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

export const RestaurantServicesSection = () => {
  const services = [
    {
      img: "https://i.ibb.co/bgn8q4FT/Screenshot-517.png",
      title: "Get Instant QR Codes",
      desc: "Enhance service and set new dining standards with our QR codes featuring your brand customizations.",
    },
    {
      img: "https://i.ibb.co/HLn7tZwJ/Screenshot-510.png",
      title: "Business Intelligence Hub",
      desc: "Make data-driven decisions with real-time sales trends and customer insights",
    },
    {
      img: "https://i.ibb.co/0RV8k4gR/Screenshot-511.png",
      title: "Live Order Symphony",
      desc: "Seamless coordination between tables, kitchen, and delivery with 99.9% accuracy",
    },
    {
      img: "https://i.ibb.co/rTb5dSL/Screenshot-513.png",
      title: "Instant Menu Mastery",
      desc: "Update offerings across all platforms in seconds, never miss a sales opportunity",
    },
    {
      img: "https://i.ibb.co/Jjz04DZn/Screenshot-512.png",
      title: "Kitchen Command Center",
      desc: "95% faster order processing with prioritized tickets and chef alerts",
    },
    {
      img: "https://i.ibb.co/bRzzZ0vr/Screenshot-514.png",
      title: "QR Fortress Security",
      desc: "Protect your digital assets with location-based access control",
    },
  ];

  const menudemo = [
    {
      img: "https://i.ibb.co/tTCjT22T/mediamodifier-image.png",
      title: "Smart Digital Menu",
      desc: "Dynamic menu that updates instantly, reducing customer wait times by 40%",
    },
  ];

  return (
    <SectionWrapper bgColor="bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header - Keep existing header animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Empower Your <span className="text-gold">Restaurant</span> Ecosystem
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Next-gen tools that transform operations and elevate guest
            experiences
          </p>
          <div className="mt-8 h-1 w-24 bg-gold mx-auto" />
        </motion.div>

        {/* Alternating Feature Layout */}
        <div className="space-y-16">
          {menudemo.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className={`group relative flex flex-col ${
                idx % 2 ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-8 md:gap-12 p-8 rounded-2xl bg-gradient-to-r ${
                idx % 2
                  ? "from-green-50/50 to-white"
                  : "from-white to-green-50/50"
              } hover:bg-green-50/30 transition-colors`}
            >
              {/* Image Container */}
              <div className="relative flex w-full md:w-1/2 justify-center overflow-hidden rounded-xl shadow-2xl">
                <div className="h-full  w-auto bg-stone-50">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="h-full w-auto justify-center object-cover transform transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-green-800/10 rounded-xl pointer-events-none" />
                </div>
              </div>

              {/* Content Container */}
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-3xl font-bold text-green-800 relative">
                  <span className="absolute -left-6 top-3 w-4 h-4 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {service.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
                <div className="flex items-center gap-2 pt-4">
                  <div className="w-8 h-px bg-gold" />
                  <span className="text-sm font-semibold text-gold tracking-wide">
                    LEARN MORE →
                  </span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className={`group relative flex flex-col ${
                (idx + 1) % 2 ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-8 md:gap-12 p-8 rounded-2xl bg-gradient-to-r ${
                (idx + 1) % 2
                  ? "from-green-50/50 to-white"
                  : "from-white to-green-50/50"
              } hover:bg-green-50/30 transition-colors`}
            >
              {/* Image Container */}
              <div className="w-full md:w-1/2 relative overflow-hidden rounded-xl shadow-2xl">
                <div className="aspect-video bg-gradient-to-r from-green-800/20 to-gold/10">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-green-800/10 rounded-xl pointer-events-none" />
              </div>

              {/* Content Container */}
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-3xl font-bold text-green-800 relative">
                  <span className="absolute -left-6 top-3 w-4 h-4 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {service.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
                <div className="flex items-center gap-2 pt-4">
                  <div className="w-8 h-px bg-gold" />
                  <span className="text-sm font-semibold text-gold tracking-wide">
                    LEARN MORE →
                  </span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
