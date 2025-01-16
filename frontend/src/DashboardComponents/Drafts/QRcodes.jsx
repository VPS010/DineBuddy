import React, { useState } from "react";
import axios from "axios";
import { QrCode, ScanLine, UtensilsCrossed } from "lucide-react";

const QRCodeGenerator = () => {
  const [input, setInput] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [restaurant, setRestaurant] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authorization");

  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: token,
    },
  });

  const parseTableRange = (input) => {
    const ranges = input.split(",").map((range) => range.trim());
    const tableNumbers = [];

    for (const range of ranges) {
      if (range.includes("-")) {
        const [start, end] = range.split("-").map((num) => parseInt(num));
        if (isNaN(start) || isNaN(end)) {
          throw new Error("Invalid range format");
        }
        for (let i = start; i <= end; i++) {
          tableNumbers.push(i);
        }
      } else {
        const num = parseInt(range);
        if (isNaN(num)) {
          throw new Error("Invalid number format");
        }
        tableNumbers.push(num);
      }
    }

    return [...new Set(tableNumbers)].sort((a, b) => a - b);
  };

  const generateQRCodes = async () => {
    if (!localStorage.getItem("authorization")) {
      setError("Please log in to generate QR codes");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const tableNumbers = parseTableRange(input);
      const results = await Promise.all(
        tableNumbers.map(async (tableNumber) => {
          const response = await api.post("api/v1/admin/qr/generate", {
            tableNumber,
          });
          setRestaurant(response.data.restaurant);
          return {
            tableNumber,
            qrCode: response.data.qrCode,
          };
        })
      );

      setQrCodes(results);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        localStorage.removeItem("authorization");
      } else {
        setError(error.response?.data?.error || "Failed to generate QR codes");
      }
    } finally {
      setLoading(false);
    }
  };

  const cleanQRCodeData = (qrCode) => {
    return qrCode.startsWith("data:image/")
      ? qrCode
      : `data:image/png;base64,${qrCode}`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById("qr-cards-container");

    if (!printContent) {
      console.error("QR cards container not found");
      return;
    }

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Get the iframe document
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Fetch all styles from the current document
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules || [])
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          console.warn("Could not access stylesheet:", styleSheet.href);
          return "";
        }
      })
      .join("\n");

    // Write the content to the iframe
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Codes</title>
         <style>
          ${styles}
          @media print {
            body { margin: 0; padding: 16px; }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr); /* 2 cards per row */
              gap: 1rem;
              page-break-inside: avoid;
            }
            .card {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .bg-gradient-to-r {
              background: linear-gradient(to right, #064e3b, #065f46);
              color: white;
            }
            .grid-container {
              margin-bottom: 0; /* Ensure no extra space between pages */
            }
          }
         </style>

        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for images and resources to load
    iframe.onload = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error("Print failed:", e);
      }

      // Remove the iframe after printing (with a delay to ensure print dialog is handled)
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  if (!localStorage.getItem("authorization")) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>Please log in to generate QR codes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-4 pt-5">
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Enter table numbers (e.g., "1-5,8,10-12"):
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="1-5,8,10-12"
            />
            <button
              onClick={generateQRCodes}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Generating..." : "Generate QR Codes"}
            </button>
          </div>
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>

        {qrCodes.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Print QR Codes
            </button>
          </div>
        )}
      </div>

      {qrCodes.length > 0 && (
        <div id="qr-cards-container">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {qrCodes.map(({ tableNumber, qrCode }) => (
              <div
                key={tableNumber}
                className="card relative flex flex-col items-center rounded-xl shadow-lg border border-stone-200 bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-t-xl">
                  <div className="flex flex-col items-center border-b border-amber-400 pb-2">
                    <UtensilsCrossed
                      className="text-amber-400 mb-1"
                      size={24}
                    />
                    <h1 className="text-3xl font-bold tracking-wide">
                      {restaurant}
                    </h1>
                  </div>
                </div>

                <div className="mt-24 flex flex-col items-center px-6 pb-6">
                  <div className="bg-stone-100 border mt-9 border-amber-200 rounded-full px-8 py-2 mb-6">
                    <h2 className="text-xl  font-bold text-stone-800">
                      Table {tableNumber}
                    </h2>
                  </div>

                  <div className="relative p-6 bg-white rounded-xl shadow-md mb-6">
                    <img
                      src={cleanQRCodeData(qrCode)}
                      alt={`QR Code for Table ${tableNumber}`}
                      className="w-48 h-48"
                    />
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>
                  </div>

                  <div className="flex items-center gap-2 text-lg font-serif text-stone-700 mb-2">
                    <ScanLine className="text-amber-600" size={24} />
                    Scan To Place Your Order
                  </div>

                  <div className="text-center mt-6 pt-4 border-t border-stone-200 w-full">
                    <h3 className="text-2xl font-bold text-amber-600 mb-1">
                      SERVIT
                    </h3>
                    <p className="text-stone-600 text-sm font-serif italic">
                      Your Personal Digital Waiter
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
