import { motion } from "framer-motion";
import {
  ChevronRight,
  Mail,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
} from "lucide-react";

const handlePhoneClick = () => {
  window.location.href = "tel:+91 9103123156";
};

export const Footer = ({ handleEmailClick }) => (
  <footer className="bg-deep-green text-white py-20 px-4">
    <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">DineBuddy</h3>
        <div className="flex gap-4">
          {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
            <motion.div whileHover={{ y: -3 }} key={idx}>
              <Icon className="text-gold hover:text-beige-100 cursor-pointer" />
            </motion.div>
          ))}
        </div>
        <p className="text-beige-100">
          Revolutionizing dining experiences since 2025
        </p>
        <p className="text-beige-100 my-0 py-0">
          © {new Date().getFullYear()} DineBuddy. All rights reserved.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-bold">Quick Links</h4>
        {["About Us", "Contact", "FAQs", "Privacy Policy"].map((link, idx) => (
          <motion.div
            whileHover={{ x: 5 }}
            key={idx}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ChevronRight size={16} className="text-gold" />
            {link}
          </motion.div>
        ))}
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
        <motion.div
          whileHover={{ y: -3 }}
          onClick={handlePhoneClick}
          className="cursor-pointer flex items-center"
        >
          <Phone className="text-gold hover:text-beige-100 mx-2" />
          +91 9103123156
        </motion.div>
      </div>
    </div>
  </footer>
);
