import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";
import { QrCode, X } from "lucide-react";

const QRScannerModal = ({ isOpen, onClose, onScan }) => {
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const readerRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const initializeScanner = async () => {
      if (isOpen && readerRef.current) {
        try {
          scannerRef.current = new Html5Qrcode(readerRef.current.id);

          const qrConfig = {
            fps: 10,
            qrbox: {
              width: isMobile ? Math.min(250, window.innerWidth - 64) : 300,
              height: isMobile ? Math.min(250, window.innerWidth - 64) : 300,
            },
          };

          await scannerRef.current.start(
            { facingMode: "environment" },
            qrConfig,
            (decodedText) => {
              scannerRef.current.stop();
              onScan(decodedText);
            },
            (errorMessage) => {
              if (errorMessage.includes("NotFoundError")) {
                setError(
                  "Camera not found. Please ensure you have a working camera."
                );
              } else if (errorMessage.includes("NotAllowedError")) {
                setError(
                  "Camera permission denied. Please allow camera access."
                );
              } else if (!errorMessage.includes("No QR code found")) {
                setError("Camera error: " + errorMessage);
              }
            }
          );
        } catch (err) {
          setError(
            "Failed to initialize scanner. Please refresh and try again."
          );
          console.error("Scanner error:", err);
        }
      }
    };

    initializeScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch((err) => {
          if (!err.message.includes("Scanner is not running")) {
            console.error("Error stopping scanner:", err);
          }
        });
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
              <br />
              {error.includes("permission") && (
                <span className="text-xs text-gray-600 block mt-2">
                  (Check browser settings or try in a different browser)
                </span>
              )}
            </div>
          ) : (
            <>
              <div ref={readerRef} id="reader" className="w-full h-full" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-3 md:inset-8 border-2 border-white rounded-lg opacity-80">
                  {/* Scanner frame decorations */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Error Boundary Component (Add this at the bottom of your file)
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("QR Scanner Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4 text-center">
          Scanner failed to load. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

// Export with Error Boundary
export default function SafeQRScannerModal(props) {
  return (
    <ErrorBoundary>
      <QRScannerModal {...props} />
    </ErrorBoundary>
  );
}
