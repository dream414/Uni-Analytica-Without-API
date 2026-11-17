
const PDFDocument = require("pdfkit");

const generatePDF = (records) => {
  return new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(records) || records.length === 0) {
        throw new Error("No records available for PDF export");
      }

      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 30
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("Multilingual Data Processing Report", {
          align: "center"
        });

      doc.moveDown(0.5);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Total Records: ${records.length}`);

      doc.text(`Generated On: ${new Date().toLocaleString()}`);

      doc.moveDown();

      const headers = Object.keys(records[0]);

      const pageWidth =
        doc.page.width -
        doc.page.margins.left -
        doc.page.margins.right;

      const columnWidth = pageWidth / headers.length;
      const rowHeight = 45;

      const drawRow = (values, isHeader = false) => {
        const startX = doc.page.margins.left;
        const startY = doc.y;

        values.forEach((value, index) => {
          const x = startX + index * columnWidth;

          if (isHeader) {
            doc.rect(x, startY, columnWidth, rowHeight).fill("#1F4E78");
            doc.fillColor("#FFFFFF").font("Helvetica-Bold");
          } else {
            doc.rect(x, startY, columnWidth, rowHeight).stroke("#CCCCCC");
            doc.fillColor("#000000").font("Helvetica");
          }

          doc.fontSize(7).text(String(value ?? ""), x + 4, startY + 5, {
            width: columnWidth - 8,
            height: rowHeight - 10,
            ellipsis: true
          });
        });

        doc.y = startY + rowHeight;
      };

      drawRow(headers, true);

      records.forEach((record) => {
        if (doc.y + rowHeight > doc.page.height - 30) {
          doc.addPage({
            size: "A4",
            layout: "landscape",
            margin: 30
          });
        }

        drawRow(headers.map((header) => record[header]));
      });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generatePDF
};
