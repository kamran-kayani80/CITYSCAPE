import jsPDF from 'jspdf';
import { Report } from '../types';

/**
 * Draws the official Cityscape Skyline & Community Mesh Network vector logo onto a jsPDF instance.
 */
function drawCityscapeHeaderLogo(doc: jsPDF, startX: number, startY: number) {
  // --- Skyline Buildings (Progressive Blue / Cyan) ---
  doc.setDrawColor(56, 189, 248); // #38BDF8
  doc.setLineWidth(0.8);

  // Building 1 (Far left low-rise)
  doc.line(startX + 2, startY + 16, startX + 2, startY + 9);
  doc.line(startX + 2, startY + 9, startX + 6, startY + 9);
  doc.line(startX + 6, startY + 9, startX + 6, startY + 16);

  // Building 2 (Mid-rise with angled roof)
  doc.line(startX + 6, startY + 16, startX + 6, startY + 6);
  doc.line(startX + 6, startY + 6, startX + 9, startY + 3);
  doc.line(startX + 9, startY + 3, startX + 12, startY + 6);
  doc.line(startX + 12, startY + 6, startX + 12, startY + 16);

  // Building 3 (Spire tower)
  doc.line(startX + 12, startY + 16, startX + 12, startY + 3);
  doc.line(startX + 12, startY + 3, startX + 15, startY + 0);
  doc.line(startX + 15, startY + 0, startX + 18, startY + 3);
  doc.line(startX + 18, startY + 3, startX + 18, startY + 16);

  // Baseline
  doc.line(startX + 0, startY + 16, startX + 36, startY + 16);

  // --- Community Mesh Network (Coral & Teal) ---
  doc.setDrawColor(255, 90, 54); // Engaged Coral
  doc.setLineWidth(0.6);
  doc.line(startX + 18, startY + 9, startX + 23, startY + 4);
  doc.line(startX + 23, startY + 4, startX + 29, startY + 1);
  doc.line(startX + 29, startY + 1, startX + 34, startY + 5);
  doc.line(startX + 34, startY + 5, startX + 32, startY + 13);

  doc.setDrawColor(45, 212, 191); // Community Teal
  doc.line(startX + 23, startY + 4, startX + 32, startY + 13);
  doc.line(startX + 29, startY + 1, startX + 25, startY + 12);

  // Nodes
  doc.setFillColor(56, 189, 248);
  doc.circle(startX + 18, startY + 9, 1.1, 'F');
  doc.setFillColor(255, 90, 54);
  doc.circle(startX + 23, startY + 4, 1.2, 'F');
  doc.setFillColor(45, 212, 191);
  doc.circle(startX + 29, startY + 1, 1.3, 'F');
  doc.setFillColor(255, 90, 54);
  doc.circle(startX + 34, startY + 5, 1.2, 'F');
  doc.setFillColor(45, 212, 191);
  doc.circle(startX + 32, startY + 13, 1.1, 'F');
  doc.setFillColor(56, 189, 248);
  doc.circle(startX + 25, startY + 12, 1.1, 'F');
}

/**
 * Downloads a Tax Invoice / Receipt styled in strict accordance with Cityscape Brand Guidelines.
 */
export function downloadInvoicePDF(
  invoiceNumber = 'INV-2026-0725',
  amount = '25.00',
  email = 'procurement@sfpublicworks.org'
) {
  try {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // --- HEADER BANNER: Civic Navy (#0A2540) ---
    doc.setFillColor(10, 37, 64);
    doc.rect(0, 0, 210, 48, 'F');

    // Vector Brand Mark
    drawCityscapeHeaderLogo(doc, 14, 12);

    // Brand Name: CITYSCAPE
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CITYSCAPE', 56, 22);

    // Brand Slogan (Mandatory Brand Language)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(204, 255, 0); // Lime Highlight (#CCFF00)
    doc.text('Inclusive by design. Exclusive by experience.', 56, 29);

    doc.setFontSize(8.5);
    doc.setTextColor(226, 232, 240);
    doc.text('Municipal Desk Enterprise SaaS Tax Invoice', 56, 36);

    // Paid / Active Badge (Community Teal)
    doc.setFillColor(0, 128, 128); // #008080 Community Teal
    doc.roundedRect(142, 15, 53, 16, 3, 3, 'F');
    doc.setTextColor(204, 255, 0); // Lime Text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID / MUNICIPAL VERIFIED', 145, 25);

    // --- DOCUMENT BODY SECTION ---
    doc.setTextColor(17, 24, 39); // Charcoal Dark (#111827)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`INVOICE REFERENCE: ${invoiceNumber}`, 15, 60);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`Date of Issue: ${today}`, 15, 68);
    doc.text(`Billing Contact: ${email}`, 15, 75);
    doc.text(`Municipal Department: Public Works & Civic Administration Desk`, 15, 82);
    doc.text(`Tax EIN Reference: XX-XXX9042 (Municipal Exemption Verified)`, 15, 89);

    // Divider Line (Outline Slate)
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.6);
    doc.line(15, 96, 195, 96);

    // --- TABLE HEADER: Warm Canvas Surface (#F8FAFC) ---
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 102, 180, 11, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 37, 64); // Civic Navy
    doc.text('Subscription / Service Description', 20, 109);
    doc.text('Qty', 142, 109);
    doc.text('Total', 172, 109);

    // Table Item Line
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text('CITYSCAPE Municipal Desk SaaS Plan (Monthly)', 20, 123);
    doc.text('1', 144, 123);
    doc.text(`$${amount} USD`, 172, 123);

    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('• Unlimited Emergency Triage Desk & Kanban Neighborhood Work Orders', 20, 131);
    doc.text('• AI Fraud Shield & Forensic Image Authenticity Verification', 20, 137);
    doc.text('• Real-time Resident Communications & Official Civic Seal Proofs', 20, 143);

    doc.line(15, 152, 195, 152);

    // --- SUMMARY TOTALS ---
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(`Subtotal: $${amount} USD`, 135, 164);
    doc.text(`Sales Tax / Municipal Fee: $0.00 USD`, 120, 172);

    doc.setFontSize(13);
    doc.setTextColor(10, 37, 64); // Civic Navy
    doc.text(`Total Paid: $${amount} USD`, 135, 184);

    // --- OFFICIAL BRAND SEAL BOX ---
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, 202, 180, 48, 4, 4, 'FD');

    // Accent left stripe (Action Amber #B45309)
    doc.setFillColor(180, 83, 9);
    doc.rect(15, 202, 4, 48, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 37, 64);
    doc.text('CITYSCAPE OFFICIAL MUNICIPAL VERIFICATION SEAL', 24, 214);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('This document serves as an official receipt for municipal software procurement.', 24, 222);
    doc.text('Generated under SAM.gov clearance protocol • Inclusive by design. Exclusive by experience.', 24, 228);
    doc.text('Contact Support: contact@cityscape.solutions | https://cityscape.solutions', 24, 234);

    doc.save(`${invoiceNumber}.pdf`);
  } catch (error) {
    console.error('PDF Invoice Generation Error:', error);
    // Blob Fallback
    const fallbackText = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 150 >>\nstream\nBT /F1 18 Tf 50 700 Td (CITYSCAPE Municipal Invoice #${invoiceNumber}) Tj 0 -25 Td (Inclusive by design. Exclusive by experience.) Tj 0 -25 Td (Amount Paid: $${amount} USD) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000244 00000 n\n0000000444 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n515\n%%EOF`;
    const blob = new Blob([fallbackText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Downloads a Neighborhood Civic Report PDF styled in strict accordance with Cityscape Brand Guidelines.
 */
export function downloadReportPDF(report: Report) {
  try {
    const doc = new jsPDF();

    // --- HEADER BANNER: Civic Navy (#0A2540) ---
    doc.setFillColor(10, 37, 64);
    doc.rect(0, 0, 210, 48, 'F');

    // Vector Brand Mark
    drawCityscapeHeaderLogo(doc, 14, 12);

    // Title: CITYSCAPE
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CITYSCAPE', 56, 22);

    // Slogan: Inclusive by design. Exclusive by experience.
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(204, 255, 0); // Lime Highlight
    doc.text('Inclusive by design. Exclusive by experience.', 56, 29);

    doc.setFontSize(8.5);
    doc.setTextColor(226, 232, 240);
    doc.text(`Official Neighborhood Civic Report • Ref ID: ${report.id.slice(0, 8)}`, 56, 36);

    // Official Badge
    doc.setFillColor(0, 128, 128); // Community Teal
    doc.roundedRect(138, 15, 58, 16, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL CIVIC REPORT', 142, 25);

    // --- REPORT CONTENT ---
    doc.setTextColor(10, 37, 64); // Civic Navy
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');

    const splitTitle = doc.splitTextToSize(report.title, 180);
    doc.text(splitTitle, 15, 62);

    let currentY = 62 + splitTitle.length * 7;

    // Key Value Info Card Box (Warm Canvas #F8FAFC)
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, currentY, 180, 42, 3, 3, 'FD');

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);

    doc.text(`Category: ${report.category}`, 22, currentY + 10);
    doc.text(`Severity Level: ${report.severity}`, 105, currentY + 10);

    doc.text(`Status: ${report.status}`, 22, currentY + 20);
    const expectedDays = report.slaHoursTarget ? Math.round(report.slaHoursTarget / 24) : 3;
    doc.text(`Expected Resolution Time: ${expectedDays} Days`, 105, currentY + 20);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Location: ${report.addressText || 'District Ward Boundary'}`, 22, currentY + 30);
    doc.text(`Reported By: ${report.userName} (${report.isGuest ? 'Community Guest' : 'Verified Resident'})`, 22, currentY + 37);

    currentY += 52;

    // Divider Line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);

    currentY += 10;

    // Issue Description Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 37, 64);
    doc.text('Neighborhood Issue Description:', 15, currentY);

    currentY += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);

    const splitDesc = doc.splitTextToSize(report.description || 'No detailed description provided by resident.', 180);
    doc.text(splitDesc, 15, currentY);

    currentY += splitDesc.length * 6 + 10;

    // Official Public Works Dispatch Notes
    if (report.officialNote) {
      doc.setFillColor(240, 253, 250); // Light Teal
      doc.setDrawColor(0, 128, 128);
      doc.roundedRect(15, currentY, 180, 32, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 109, 91); // Community Teal
      doc.text('City Team / Public Works Crew Dispatch Note:', 22, currentY + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      const splitNote = doc.splitTextToSize(report.officialNote, 168);
      doc.text(splitNote, 22, currentY + 18);

      currentY += 40;
    }

    // AI Forensic Authenticity Shield Notice
    if (report.aiForensics) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 128, 128);
      doc.text(`AI Forensic Shield: Image Authenticity ${report.aiForensics.isAiGenerated ? 'SYNTHETIC WARNING' : 'VERIFIED REAL'} (${report.aiForensics.aiProbability}% AI Probability)`, 15, currentY);
      currentY += 10;
    }

    // Footer Verification Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, 235, 180, 42, 4, 4, 'FD');

    // Action Amber stripe
    doc.setFillColor(180, 83, 9);
    doc.rect(15, 235, 4, 42, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 37, 64);
    doc.text('CITYSCAPE CIVIC ENGAGEMENT PLATFORM', 24, 247);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Bridging the gap between residents and local municipal public administration.', 24, 255);
    doc.text('Inclusive by design. Exclusive by experience.', 24, 261);
    doc.text('Official Document • Cityscape Civic Network • https://cityscape.solutions', 24, 267);

    doc.save(`Civic-Report-${report.id.slice(0, 8)}.pdf`);
  } catch (err) {
    console.error('PDF Report Export Error:', err);
    try {
      const fallbackText = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 160 >>\nstream\nBT /F1 16 Tf 50 700 Td (CITYSCAPE OFFICIAL CIVIC REPORT: ${report.title.replace(/[()]/g, '')}) Tj 0 -25 Td (Inclusive by design. Exclusive by experience.) Tj 0 -25 Td (Status: ${report.status}) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000244 00000 n\n0000000454 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n525\n%%EOF`;
      const blob = new Blob([fallbackText], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Civic-Report-${report.id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(`Could not save PDF file directly. Here is the report summary:\n\nTitle: ${report.title}\nID: ${report.id}\nStatus: ${report.status}\nLocation: ${report.addressText}`);
    }
  }
}

