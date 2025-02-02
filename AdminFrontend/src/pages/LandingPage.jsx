import {
  motion,
  useAnimation,
  AnimatePresence,
  useInView,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { useInView as useScrollInView } from "react-intersection-observer";
import QRScannerModal from "../components/QrScannnerModle";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  Clock,
  Star,
  Wallet,
  Camera,
  Sparkles,
  Utensils,
  Mail,
  BookUser,
  Gem,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
} from "lucide-react";

const LandingPage = () => {
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      const img = new Image();
      img.src =
        "https://i.ibb.co/jPYGBXs5/pngtree-sophisticated-bar-and-restaurant-boasting-luxurious-modern-design-featuring-elegant-furnishi.png";
      img.onload = () => setIsHeroLoaded(true);
      img.onerror = () => setIsHeroLoaded(true); // Fallback if image fails to load
    };

    loadImage();
  }, []);

  const handleScanComplete = (result) => {
    setIsQRScannerOpen(false);
    // Check if the result is a valid URL
    try {
      new URL(result);
      window.location.href = result;
    } catch {
      alert("Invalid QR code. Please scan a valid URL.");
    }
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:hellodinebuddy@gmail.com";
  };

  return (
    <div className="font-sans justify-center flex flex-col bg-beige-50">
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
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax effect */}

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
          className="relative text-center px-4 space-y-8 max-w-7xl mx-auto"
        >
          {/* Animated decorative elements */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-20 -left-20 w-48 h-48 bg-green-700/20 rounded-full blur-xl"
          />
          <div>
            <div className="space-y-8">
              <h1 className="sm:text-5xl md:text-6xl  lg:text-7xl font-bold text-white drop-shadow-2xl px-4 leading-tight">
                <p className="bg-gradient-to-r text-5xl md:text-6xl  lg:text-7xl from-green-600 to-green-500 bg-clip-text text-transparent">
                  DineBuddy
                </p>
                <br />
                <p className="font-serif font-thin md:font-bold text-4xl md:text-6xl lg:text-7xl">
                  Your Personal Digital Waiter
                </p>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl text-white max-w-5xl mx-auto font-light tracking-wide"
              >
                Effortless Ordering & Dining – No More Waiting, Just Enjoy Your
                Meal.
              </motion.p>
            </div>
            {/* CTA Buttons Container */}
            <div className="space-y-4 md:mt-20">
              <motion.div
                className="flex flex-col md:flex-row gap-4 justify-center"
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
                  className="bg-green-800 mt-2 md:mt-0 text-white px-10 py-5 rounded-xl border-2 border-stone-100 text-xl font-semibold shadow-2xl flex items-center gap-3 hover:border-gray-700 hover:bg-green-800 transition-colors"
                >
                  <QrCode size={28} className="shrink-0" />
                  <span>Scan QR to Order</span>
                  <ChevronRight size={20} className="ml-1" />
                </motion.button>

                {/* Secondary CTA */}
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "gray-700",
                  }}
                  className="bg-gold text-white px-10 py-5 rounded-xl text-xl font-semibold border-2 border-stone-100 hover:border-gray-700 flex items-center gap-2"
                  onClick={() => {
                    navigate("/admin/login");
                  }}
                >
                  <Utensils size={24} />
                  Restaurant Login
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Animated Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute  left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="text-gold h-12 w-12" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <SectionWrapper bgColor="bg-white">
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
            {[
              {
                icon: <QrCode className="text-green-800" />,
                title: "QR-Based Ordering",
                desc: "Instant menu access with a simple scan",
              },
              {
                icon: <Clock className="text-green-800" />,
                title: "Live Order Symphony",
                desc: "Live updates from kitchen to table",
              },
              {
                icon: <Star className="text-green-800" />,
                title: "Smart Digital Menu",
                desc: "Curated recommendations at your fingertips",
              },
              {
                icon: <Wallet className="text-green-800" />,
                title: "Secure Payments",
                desc: "Multiple payment options in one tap",
              },
            ].map((feature, idx) => (
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
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Subtle Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-green-800 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>
      {/* Effortless Experience Section */}
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
            {[
              {
                icon: <Sparkles className="text-green-800" />,
                title: "Instant Menu Access",
                desc: "Guests browse your offerings the moment they sit down – no waiting, no paper menus",
                benefit:
                  "85% of diners prefer digital menus for quicker decisions*",
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
            ].map((step, idx) => (
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

      <div className="md:px-44 px-4">
        {" "}
        {/* Comfort Guarantee CTA */}
        <motion.div
          className=" text-center mt-6 md:flex justify-between bg-maroon/90 p-2 rounded-2xl shadow-lg border-2 border-gold/20"
          initial={{ scale: 0.98 }}
          whileInView={{ scale: 1 }}
        >
          <div className="md:flex justify-between gap-x-5 mx-auto">
            <div>
              <p className="text-gray-100 mb-2">
                Restaurants using DineBuddy report 4.8/5 comfort scores from
                diners.
              </p>
              <span className="block mt-2 text-xl text-gold">
                "Finally, technology that disappears – leaving just great food
                and conversation."
              </span>
            </div>
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-green-800 mt-5 md:mt-0 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                onClick={() => {
                  navigate("/admin/login");
                }}
              >
                <Utensils className="w-6 h-6" />
                Serve Comfort on Every Plate
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Restaurant Services Section */}
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
              Empower Your <span className="text-gold">Restaurant</span>{" "}
              Ecosystem
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Next-gen tools that transform operations and elevate guest
              experiences
            </p>
            <div className="mt-8 h-1 w-24 bg-gold mx-auto" />
          </motion.div>

          {/* Alternating Feature Layout */}
          <div className="space-y-16">
            {[
              {
                img: "https://i.ibb.co/tTCjT22T/mediamodifier-image.png",
                title: "Smart Digital Menu",
                desc: "Dynamic menu that updates instantly, reducing customer wait times by 40%",
              },
            ].map((service, idx) => (
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
            {[
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
            ].map((service, idx) => (
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

      {/* Restaurant Benefits */}
      {/* Restaurant Benefits */}
      <SectionWrapper bgColor="bg-green-50">
        <div className="container mx-auto px-4 overflow-x-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1}}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-sm md:max-w-md rounded-xl aspect-square bg-white shadow-lg overflow-hidden">
                <img
                  src="https://i.ibb.co/kggpdn6m/herosec.png"
                  alt="Restaurant analytics"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration:1 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 max-w-xl"
            >
              <div className="space-y-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-green-800">
                  Transform Your <span className="text-gold">Restaurant</span>{" "}
                  Operations
                </h2>
                <div className="h-1 w-16 bg-yellow-600" />
              </div>

              <ul className="space-y-6 mb-8">
                {[
                  "30% faster table turnover",
                  "Real-time sales analytics dashboard",
                  "Reduced staffing costs through automation",
                  "Customizable branding integration",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center border border-yellow-200">
                      <CheckCircle className="text-yellow-600 w-5 h-5" />
                    </div>
                    <p className="text-lg text-gray-700">{item}</p>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full sm:w-auto bg-gold text-white px-6 py-3 rounded-lg font-semibold 
          hover:bg-gold/90 transition-colors flex items-center justify-center gap-2
          shadow-md hover:shadow-lg"
                onClick={() => {
                  navigate("/admin/login");
                }}
              >
                <ArrowRight className="w-5 h-5" />
                <span>Optimize Your Restaurant</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
      {/* Pricing Section */}
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
              released, Therefore you can Try all our available Services for
              Free
            </button>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 px-4">
            {[
              {
                title: "Basic",
                price: "2000",
                features: [
                  "Up to 10 tables",
                  "Basic Analytics",
                  "Email Support",
                  "QR Menu System",
                ],
                popular: false,
              },
              {
                title: "Professional",
                price: "3500",
                features: [
                  "Up to 50 tables",
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
                  "Unlimited Tables",
                  "Dedicated Support",
                  "API Access",
                  "Custom Integrations",
                  "Multi-location",
                ],
                popular: false,
              },
            ].map((plan, idx) => (
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
      <footer className="bg-deep-green text-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">DineBuddy</h3>
            <p className="text-beige-100 my-0 py-0">
              © {new Date().getFullYear()} BiteBridge. All rights reserved.
            </p>
            <p className="text-beige-100">
              Revolutionizing dining experiences since 2025
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <motion.div whileHover={{ y: -3 }} key={idx}>
                  <Icon className="text-gold hover:text-beige-100 cursor-pointer" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold">Quick Links</h4>
            {["About Us", "Contact", "FAQs", "Privacy Policy"].map(
              (link, idx) => (
                <motion.div
                  whileHover={{ x: 5 }}
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ChevronRight size={16} className="text-gold" />
                  {link}
                </motion.div>
              )
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold">Newsletter</h4>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-beige-100/20 text-gray-800 rounded-lg px-4 py-2 placeholder-beige-100/50 flex-1"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-gold text-deep-green px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowRight size={20} />
              </motion.button>
            </form>
            <motion.div
              whileHover={{ y: -3 }}
              onClick={handleEmailClick}
              className="cursor-pointer flex"
            >
              <Mail className="text-gold hover:text-beige-100 mx-2" />
              hellodinebuddy@gmail.com
            </motion.div>
          </div>
        </div>
      </footer>
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleScanComplete}
      />
    </div>
  );
};

// Reusable Components
const SectionWrapper = ({ children, bgColor = "bg-white" }) => (
  <section className={`py-20 px-4 ${bgColor}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

export default LandingPage;
