import React, { useState } from "react";
import axios from "axios";
import QRCard from "./QRCard";
import handlePrint from "./HandlePrint";

const QRCodeGenerator = () => {
  const [input, setInput] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [restaurant, setRestaurant] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authorization");

  const api = axios.create({
    baseURL: "https://dinebuddy.in",
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
              <QRCard
                key={tableNumber}
                tableNumber={tableNumber}
                qrCode={qrCode}
                restaurant={restaurant}
                cleanQRCodeData={cleanQRCodeData}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;