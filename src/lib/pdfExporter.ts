import jsPDF from 'jspdf';
import { Report } from '../types';

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

    // Header Dark Banner
    doc.setFillColor(30, 27, 75); // Dark Indigo
    doc.rect(0, 0, 210, 42, 'F');

    // Branding Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CITYSCAPE SOLUTIONS', 15, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Municipal Desk Enterprise SaaS Tax Invoice', 15, 32);

    // Invoice Status Badge
    doc.setFillColor(16, 185, 129); // Emerald
    doc.roundedRect(145, 14, 50, 14, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID / ACTIVE', 152, 23);

    // Meta Details Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`INVOICE NUMBER: ${invoiceNumber}`, 15, 56);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date of Issue: ${today}`, 15, 65);
    doc.text(`Billing Contact: ${email}`, 15, 73);
    doc.text(`Payment Gateway: Stripe / Municipal P-Card Authorization`, 15, 81);
    doc.text(`Tax EIN Reference: XX-XXX9042 (Municipal Tax Exempt Verified)`, 15, 89);

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 96, 195, 96);

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 102, 180, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('Subscription Description', 20, 108.5);
    doc.text('Qty', 140, 108.5);
    doc.text('Total', 170, 108.5);

    // Table Item Line
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('CITYSCAPE Municipal Desk SaaS Plan (Monthly)', 20, 122);
    doc.text('1', 142, 122);
    doc.text(`$${amount} USD`, 170, 122);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('• Unlimited Emergency Triage Desk & Kanban Work Orders', 20, 130);
    doc.text('• AI Fraud Shield & Deepfake Photo Verification', 20, 136);
    doc.text('• Real-time Resident Communications & Official Seal Proofs', 20, 142);

    doc.line(15, 150, 195, 150);

    // Summary Totals
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`Subtotal: $${amount} USD`, 135, 162);
    doc.text(`Sales Tax / Municipal Fee: $0.00 USD`, 120, 170);
    doc.setFontSize(13);
    doc.setTextColor(79, 70, 229); // Indigo
    doc.text(`Total Paid: $${amount} USD`, 135, 182);

    // Verification Seal Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, 200, 180, 45, 4, 4, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('CITYSCAPE OFFICIAL MUNICIPAL VERIFICATION SEAL', 22, 212);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('This document serves as an official receipt for municipal software procurement.', 22, 220);
    doc.text('Generated electronically under SAM.gov clearance protocol.', 22, 226);
    doc.text('Contact Support: contact@cityscape.solutions | https://cityscape.solutions', 22, 232);

    // Trigger download
    doc.save(`${invoiceNumber}.pdf`);
  } catch (error) {
    console.error('PDF Invoice Generation Error:', error);
    // Robust Blob Fallback
    const fallbackText = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 120 >>\nstream\nBT /F1 18 Tf 50 700 Td (CITYSCAPE Municipal Invoice #${invoiceNumber}) Tj 0 -30 Td (Amount Paid: $${amount} USD) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000244 00000 n\n0000000414 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n485\n%%EOF`;
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

export function downloadReportPDF(report: Report) {
  try {
    const doc = new jsPDF();

    // Header Banner
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('CIVIC INCIDENT REPORT', 15, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`CITYSCAPE Infrastructure Tracking System • ID: ${report.id}`, 15, 29);

    // Content
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(report.title, 15, 50);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Category: ${report.category} | Severity: ${report.severity} | Status: ${report.status}`, 15, 58);
    doc.text(`Location: ${report.addressText}`, 15, 65);
    doc.text(`Submitted By: ${report.userName} (${report.isGuest ? 'Guest' : 'Verified Resident'})`, 15, 72);
    doc.text(`Date Filed: ${report.createdAt}`, 15, 79);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 86, 195, 86);

    doc.setFont('helvetica', 'bold');
    doc.text('Issue Description:', 15, 95);
    doc.setFont('helvetica', 'normal');

    const splitDesc = doc.splitTextToSize(report.description || 'No description provided.', 180);
    doc.text(splitDesc, 15, 103);

    let yPos = 103 + splitDesc.length * 6;

    if (report.officialNote) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(79, 70, 229);
      doc.text('Official Municipal Dispatch Notes:', 15, yPos + 10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const splitNote = doc.splitTextToSize(report.officialNote, 180);
      doc.text(splitNote, 15, yPos + 18);
    }

    doc.save(`Incident-Report-${report.id.slice(0, 8)}.pdf`);
  } catch (err) {
    console.error('PDF Report Export Error:', err);
    try {
      const fallbackText = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 120 >>\nstream\nBT /F1 16 Tf 50 700 Td (CIVIC INCIDENT REPORT: ${report.title.replace(/[()]/g, '')}) Tj 0 -30 Td (Status: ${report.status}) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000244 00000 n\n0000000414 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n485\n%%EOF`;
      const blob = new Blob([fallbackText], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Incident-Report-${report.id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(`Could not save PDF file directly. Here is the report summary:\n\nTitle: ${report.title}\nID: ${report.id}\nStatus: ${report.status}\nLocation: ${report.addressText}`);
    }
  }
}
