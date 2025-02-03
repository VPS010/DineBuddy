import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QRScannerModal from "../../components/QrScannnerModle";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { EffortlessExperienceSection } from "./EffortlessExperienceSection";
import { ComfortGuaranteeCTA } from "./ComfortGuaranteeCTA";
import { RestaurantBenefitsSection } from "./RestaurantBenefitsSection";
import { RestaurantServicesSection } from "./RestaurantServicesSection";
import { PricingSection } from "./PricingSection";
import { Footer } from "./Footer";

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

  // Loader effect remains
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
      <HeroSection
        setIsQRScannerOpen={setIsQRScannerOpen}
        isHeroLoaded={isHeroLoaded}
        navigate={navigate}
      />

      <FeaturesSection />
      <EffortlessExperienceSection />
      <ComfortGuaranteeCTA navigate={navigate} />
      <RestaurantServicesSection />
      <RestaurantBenefitsSection navigate={navigate} />
      <PricingSection />
      <Footer handleEmailClick={handleEmailClick} />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleScanComplete}
      />
    </div>
  );
};
export default LandingPage;
