import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Utensils, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = ({ setIsQRScannerOpen, isHeroLoaded }) => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[url('https://i.ibb.co/jPYGBXs5/pngtree-sophisticated-bar-and-restaurant-boasting-luxurious-modern-design-featuring-elegant-furnishi.png')] bg-cover bg-center"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-green-800/50" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative text-center px-4 space-y-8 max-w-7xl mx-auto w-full"
      >
        {/* Animated decorative elements */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute md:-top-20 md:-left-20 -top-10 -left-10 w-32 h-32 md:w-48 md:h-48 bg-green-700/20 rounded-full blur-xl"
        />
        <div>
          <div className="space-y-4 md:space-y-8">
            <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl px-4 leading-tight">
              <p className="bg-gradient-to-r text-5xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl from-green-600 to-green-500 bg-clip-text text-transparent">
                DineBuddy
              </p>
              <br />
              <p className="font-serif font-thin md:font-bold text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
                Your Personal Digital Waiter
              </p>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-3xl text-white max-w-5xl mx-auto font-light tracking-wide px-2"
            >
              Effortless Ordering & Dining – No More Waiting, Just Enjoy Your
              Meal.
            </motion.p>
          </div>
          {/* CTA Buttons Container */}
          <div className="space-y-4 md:mt-20 mt-12">
            <motion.div
              className="flex flex-col md:flex-row gap-4 justify-center px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* Primary CTA */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsQRScannerOpen(true)}
                className="bg-green-800 text-white px-6 py-4 md:px-10 md:py-5 rounded-xl border-2 border-stone-100 text-lg md:text-xl font-semibold shadow-2xl flex items-center gap-3 justify-center hover:border-gray-700 hover:bg-green-800 transition-colors"
              >
                <QrCode size={24} className="shrink-0" />
                <span>Scan QR to Order</span>
                <ChevronRight size={18} className="ml-1" />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "gray-700",
                }}
                className="bg-gold text-white px-6 py-4 md:px-10 md:py-5 rounded-xl text-lg md:text-xl font-semibold border-2 border-stone-100 hover:border-gray-700 flex items-center gap-2 justify-center"
                onClick={() => {
                  navigate("/admin/login");
                }}
              >
                <Utensils size={20} />
                Restaurant Login
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute w-full flex justify-center -bottom-16 md:-bottom-20">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{ cursor: "pointer" }}
          >
            <ChevronDown
              className="text-gold h-12 w-12 md:h-12 md:w-12"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {!isHeroLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
