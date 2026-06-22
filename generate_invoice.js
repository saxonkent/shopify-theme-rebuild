// Generates Invoice_139_Andrea_Sanchez.pdf in the SAXON KENT house style.
// Mirrors the layout/branding of Invoice_138_Thomas_Cussins.pdf.
const PDFDocument = require("pdfkit");
const fs = require("fs");

const OUT = "Invoice_139_Andrea_Sanchez.pdf";

// Palette
const INK = "#111111";
const MUTED = "#6b6b6b";
const LINE = "#dddddd";
const ACCENT = "#000000";

const doc = new PDFDocument({ size: "A4", margin: 0 });
doc.pipe(fs.createWriteStream(OUT));

const PAGE_W = doc.page.width; // 595.28
const M = 56; // content margin
const CW = PAGE_W - M * 2;
let y = 50;

// Helper: spaced caps label
function label(text, x, yy, opts = {}) {
  doc
    .font("Helvetica")
    .fontSize(opts.size || 8)
    .fillColor(opts.color || MUTED)
    .text(text.toUpperCase(), x, yy, {
      characterSpacing: opts.cs ?? 2,
      width: opts.width,
      align: opts.align || "left",
    });
}

// ---------- Header ----------
doc
  .font("Helvetica-Bold")
  .fontSize(22)
  .fillColor(INK)
  .text("SAXON KENT", M, y, { characterSpacing: 6 });

label("Invoice", M, y + 30, { size: 9, cs: 4, color: MUTED });

y += 56;
doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(1).strokeColor(LINE).stroke();
y += 18;

// ---------- From / Billed To (two columns) ----------
const colGap = 30;
const colW = (CW - colGap) / 2;
const leftX = M;
const rightX = M + colW + colGap;
const blockTop = y;

label("From", leftX, y, { cs: 2 });
label("Billed To", rightX, y, { cs: 2 });
y += 16;

doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK);
doc.text("Saxon Kent Photography", leftX, y, { width: colW });
doc.text("Andrea Sánchez", rightX, y, { width: colW });

let ly = doc.y + 2;
doc.font("Helvetica").fontSize(9.5).fillColor(MUTED);
const fromLines = [
  "22 Caniaba Crescent, Byron Bay NSW 2481",
  "Australia",
  "ABN: 79 667 862 719",
  "hello@saxonkent.com.au",
  "saxonkent.com.au",
];
const billLines = [
  "Miami, FL, USA",
  "neasanchezrealtor@gmail.com",
  "+1 (786) 370-4177",
  "Instagram: @neabocastyle",
];
doc.text(fromLines.join("\n"), leftX, ly, { width: colW, lineGap: 2 });
const fromBottom = doc.y;
doc.text(billLines.join("\n"), rightX, ly, { width: colW, lineGap: 2 });
const billBottom = doc.y;

y = Math.max(fromBottom, billBottom) + 16;
doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(1).strokeColor(LINE).stroke();
y += 16;

// ---------- Meta grid ----------
const meta = [
  ["Invoice No.", "139"],
  ["Date", "22 June 2026"],
  ["Due Date", "6 July 2026"],
  ["Currency", "USD"],
  ["Payment", "Bank Transfer (SWIFT)"],
  ["Project", "Fine Art Print — High-Resolution Digital File"],
];
const metaCols = 3;
const metaColW = CW / metaCols;
let mi = 0;
let rowTop = y;
for (let r = 0; r < Math.ceil(meta.length / metaCols); r++) {
  rowTop = y + r * 36;
  for (let c = 0; c < metaCols; c++) {
    if (mi >= meta.length) break;
    const [k, v] = meta[mi++];
    const x = M + c * metaColW;
    label(k, x, rowTop, { cs: 1.5, size: 7.5 });
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(INK)
      .text(v, x, rowTop + 12, { width: metaColW - 10 });
  }
}
y = rowTop + 36 + 4;
doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(1).strokeColor(LINE).stroke();
y += 18;

// ---------- Line items table ----------
const cDesc = M;
const cQty = M + CW - 230;
const cUnit = M + CW - 150;
const cAmt = M + CW - 70;
const wDesc = cQty - cDesc - 10;

label("Description", cDesc, y, { cs: 1.5, size: 7.5 });
label("Qty", cQty, y, { cs: 1.5, size: 7.5, width: 60, align: "right" });
label("Unit Price", cUnit - 10, y, { cs: 1.5, size: 7.5, width: 70, align: "right" });
label("Amount", cAmt - 14, y, { cs: 1.5, size: 7.5, width: 70, align: "right" });
y += 16;
doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(1).strokeColor(LINE).stroke();
y += 14;

// Item
doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK);
doc.text("High-Resolution Digital File — Fine Art Print", cDesc, y, { width: wDesc });
let iy = doc.y + 2;
doc.font("Helvetica").fontSize(9).fillColor(MUTED);
doc.text(
  "Personal-use digital licence of the selected fine art print, supplied for home printing and framing.",
  cDesc,
  iy,
  { width: wDesc, lineGap: 1.5 }
);
doc.text(
  "Delivered as a high-resolution TIFF (print-ready) plus a JPEG version.",
  cDesc,
  doc.y,
  { width: wDesc, lineGap: 1.5 }
);
const descBottom = doc.y;

// Figures aligned to first row of item
doc.font("Helvetica").fontSize(10).fillColor(INK);
doc.text("1", cQty, y, { width: 60, align: "right" });
doc.text("$150.00", cUnit - 10, y, { width: 70, align: "right" });
doc.text("$150.00", cAmt - 14, y, { width: 70, align: "right" });

y = descBottom + 16;
doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(1).strokeColor(LINE).stroke();
y += 16;

// ---------- Totals ----------
function totalRow(k, v, bold) {
  const kx = M + CW - 260;
  doc
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(bold ? 11 : 9.5)
    .fillColor(bold ? INK : MUTED)
    .text(k, kx, y, { width: 170, align: "left" });
  doc
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(bold ? 11 : 9.5)
    .fillColor(INK)
    .text(v, cAmt - 14, y, { width: 70, align: "right" });
  y += bold ? 20 : 16;
}
totalRow("Subtotal", "$150.00");
totalRow("GST (not charged)", "$0.00");
y += 2;
doc.moveTo(M + CW - 260, y).lineTo(M + CW, y).lineWidth(1).strokeColor(LINE).stroke();
y += 10;
totalRow("Total Due", "$150.00 USD", true);
y += 10;

// ---------- Payment details ----------
doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(1).strokeColor(LINE).stroke();
y += 18;
label("Payment Details", M, y, { cs: 2, color: INK });
y += 18;

const pay = [
  ["Beneficiary", "Saxon Kent"],
  ["Bank", "Revolut Payments Australia Pty Ltd"],
  ["Bank Address", "Level 28, 161 Castlereagh Street, Sydney NSW 2000, Australia"],
  ["Account No.", "102895778"],
  ["BIC / SWIFT", "REVOAU32"],
  ["Reference", "Invoice 139 | Andrea Sánchez"],
];
doc.fontSize(9.5);
const payKeyW = 110;
for (const [k, v] of pay) {
  doc.font("Helvetica").fillColor(MUTED).text(k, M, y, { width: payKeyW });
  doc
    .font("Helvetica-Bold")
    .fillColor(INK)
    .text(v, M + payKeyW, y, { width: CW - payKeyW });
  y = doc.y + 5;
}
y += 10;

// ---------- Notes ----------
doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(1).strokeColor(LINE).stroke();
y += 16;
label("Notes", M, y, { cs: 2, color: INK });
y += 16;
const notes = [
  "This invoice covers a personal-use, high-resolution digital file of the selected fine art print, supplied as a print-ready TIFF plus a JPEG version.",
  "The file is licensed for Andrea Sánchez's personal home printing and framing only and may not be reproduced, resold, or used commercially.",
  "No GST has been charged on this invoice.",
  "Payment due within 14 days. Please quote Invoice 139 as your reference.",
  "SWIFT transfers only — please use the BIC/SWIFT code above for international transfers.",
  "Intermediary or sender's bank fees may apply.",
];
doc.font("Helvetica").fontSize(9).fillColor(MUTED);
for (const n of notes) {
  doc.text("•  " + n, M, y, { width: CW, lineGap: 1 });
  y = doc.y + 3;
}

// ---------- Footer ----------
const footY = doc.page.height - 50;
doc.moveTo(M, footY - 12).lineTo(M + CW, footY - 12).lineWidth(1).strokeColor(LINE).stroke();
doc
  .font("Helvetica")
  .fontSize(8)
  .fillColor(MUTED)
  .text(
    "hello@saxonkent.com.au  ·  saxonkent.com.au  ·  ABN 79 667 862 719  ·  Thank you for your business.",
    M,
    footY,
    { width: CW, align: "center", characterSpacing: 0.5 }
  );

doc.end();
console.log("Wrote " + OUT);
