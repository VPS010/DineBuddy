import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";
import { QrCode, X } from "lucide-react";

const QRScannerModal = ({ isOpen, onClose, onScan }) => {
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let html5QrCode;

    if (isOpen) {
      html5QrCode = new Html5Qrcode("reader");

      const qrConfig = {
        fps: 10,
        qrbox: {
          width: isMobile ? Math.min(250, window.innerWidth - 64) : 300,
          height: isMobile ? Math.min(250, window.innerWidth - 64) : 300,
        },
      };

      html5QrCode
        .start(
          { facingMode: "environment" },
          qrConfig,
          (decodedText) => {
            html5QrCode.stop();
            onScan(decodedText);
          },
          (errorMessage) => {
            if (errorMessage.includes("NotFoundError")) {
              setError(
                "Camera not found. Please ensure you have a working camera."
              );
            } else if (errorMessage.includes("NotAllowedError")) {
              setError(
                "Camera permission denied. Please allow camera access to scan QR codes."
              );
            } else {
              // console.error(errorMessage);
            }
          }
        )
        .catch((err) => {
          setError("Error starting camera. Please try again.");
          // console.error(err);
        });
    }

    return () => {
      if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isOpen, onScan, isMobile]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 md:p-4"
    >
      <div className="relative bg-white rounded-lg md:rounded-2xl w-full max-h-[95vh] md:h-auto md:max-w-lg p-3 md:p-6 flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-2 md:right-4 top-2 md:top-4 p-1.5 hover:bg-gray-100 rounded-full touch-manipulation z-10"
        >
          <X className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        <div className="text-center mb-2 md:mb-4">
          <h3 className="text-base md:text-xl font-bold text-gray-800">
            Scan QR Code
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
            Position the QR code within the frame
          </p>
        </div>

        <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-lg bg-gray-100">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 p-3 md:p-4 text-center text-xs md:text-base">
              {error}
            </div>
          ) : (
            <>
              <div id="reader" className="w-full h-full" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-3 md:inset-8 border-2 border-white rounded-lg opacity-80">
                  <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-6 h-6 md:w-8 md:h-8 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-blue-500 rounded-tl-lg" />
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 border-t-2 md:border-t-4 border-r-2 md:border-r-4 border-blue-500 rounded-tr-lg" />
                  <div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 w-6 h-6 md:w-8 md:h-8 border-b-2 md:border-b-4 border-l-2 md:border-l-4 border-blue-500 rounded-bl-lg" />
                  <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 border-b-2 md:border-b-4 border-r-2 md:border-r-4 border-blue-500 rounded-br-lg" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QRScannerModal;
