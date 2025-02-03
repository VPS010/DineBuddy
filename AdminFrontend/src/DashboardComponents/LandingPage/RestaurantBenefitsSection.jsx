import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";

const SectionWrapper = ({ children, bgColor, id }) => (
  <section id={id} className={`py-20 px-4 ${bgColor}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

export const RestaurantBenefitsSection = ({ navigate }) => (
  <SectionWrapper bgColor="bg-green-50">
    <div className="container mx-auto px-4 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
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
          transition={{ duration: 1 }}
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
);
