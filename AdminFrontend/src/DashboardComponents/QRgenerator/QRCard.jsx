import React from 'react';
import { UtensilsCrossed, ScanLine } from "lucide-react";

const QRCard = ({ tableNumber, qrCode, restaurant, cleanQRCodeData }) => {
  return (
    <div className="card relative flex flex-col items-center rounded-xl shadow-lg border border-stone-200 bg-white hover:shadow-xl transition-shadow duration-300">
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-t-xl">
        <div className="flex flex-col items-center border-b border-amber-400 pb-2">
          <UtensilsCrossed className="text-amber-400 mb-1" size={24} />
          <h1 className="text-3xl font-bold tracking-wide">
            {restaurant}
          </h1>
        </div>
      </div>

      <div className="mt-24 flex flex-col items-center px-6 pb-6">
        <div className="bg-stone-100 border mt-9 border-amber-200 rounded-full px-8 py-2 mb-6">
          <h2 className="text-xl font-bold text-stone-800">
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
            DineBuddy
          </h3>
          <p className="text-stone-600 text-sm font-serif italic">
            Your Personal Digital Waiter
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCard;