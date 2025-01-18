const handlePrint = () => {
    const printContent = document.getElementById("qr-cards-container");
  
    if (!printContent) {
      console.error("QR cards container not found");
      return;
    }
  
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  
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
              grid-template-columns: repeat(2, 1fr);
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
              margin-bottom: 0;
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
  
    iframe.onload = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error("Print failed:", e);
      }
  
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };
  
  export default handlePrint;