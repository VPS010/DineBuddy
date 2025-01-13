const QRCode = require('qrcode');

const generateQRcode = (restaurantId, tableNumber) => {
    return new Promise((resolve, reject) => {
        if (!tableNumber || !restaurantId) {
            reject('Table number and restaurant ID are required.');
        }

        const menuUrl = `https://yourdomain.com/menu?restaurantId=${restaurantId}&table=${tableNumber}`;

        QRCode.toDataURL(menuUrl, (err, qrCodeData) => {
            if (err) {
                reject('Error generating QR code.');
            } else {
                resolve(qrCodeData);
            }
        });
    });
};


module.exports = generateQRcode;
