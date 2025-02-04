import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

// Lazy load components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const UserMenuPage = lazy(() => import("./pages/UserMenuPage"));

// Custom Loader Component
const Loader = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <AnimatePresence>
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
            className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full"
          />
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

const App = () => {
  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Common Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Customer Routes */}
            <Route path="/user/menu/:restaurantId" element={<UserMenuPage />} />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
