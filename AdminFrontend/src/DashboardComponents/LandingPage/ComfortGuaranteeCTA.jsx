import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

export const ComfortGuaranteeCTA = ({ navigate }) => (
  <div className="md:px-20 px-4">
    <motion.div
      className=" text-center mt-6 md:flex justify-between bg-maroon/90 p-2 rounded-2xl shadow-lg border-2 border-gold/20"
      initial={{ scale: 0.98 }}
      whileInView={{ scale: 1 }}
    >
      <div className="md:flex justify-between items-center gap-x-5 mx-auto">
        <div>
          <p className="text-gray-100 text-xl mb-2">
            Restaurants using DineBuddy report 4.8/5 comfort scores from diners.
          </p>
          <span className="block mt-2 text-xl text-gold">
            "Finally, technology that disappears – leaving your customers with a
            seamless and enjoyable dining experience"
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
);
