import PDFDocument from 'pdfkit';
import { formatCurrency, formatDate, generateBillNumber } from '../utils/helpers.js';

class PDFService {
  // Generate invoice PDF
  async generateInvoice(bill, user, subscription) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(24).text('Energy-as-a-Service', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).text('Invoice', { align: 'center' });
        doc.moveDown(2);

        // Bill Details
        doc.fontSize(10);
        doc.text(`Bill Number: ${generateBillNumber(bill.bill_id)}`, { align: 'left' });
        doc.text(`Bill Date: ${formatDate(bill.created_at)}`, { align: 'left' });
        doc.text(`Billing Period: ${formatDate(bill.billing_period_start)} - ${formatDate(bill.billing_period_end)}`, { align: 'left' });
        doc.moveDown(1);

        // Customer Details
        doc.fontSize(12).text('Bill To:', { underline: true });
        doc.fontSize(10);
        doc.text(user.name);
        doc.text(user.address || '');
        doc.text(`Email: ${user.email}`);
        doc.text(`Phone: ${user.phone || 'N/A'}`);
        doc.moveDown(1);

        // Subscription Details
        doc.fontSize(12).text('Subscription Details:', { underline: true });
        doc.fontSize(10);
        doc.text(`Plan: ${subscription.plan_type.replace('_', ' ').toUpperCase()}`);
        doc.text(`Solar Capacity: ${subscription.installation_capacity} kW`);
        if (subscription.battery_capacity > 0) {
          doc.text(`Battery Capacity: ${subscription.battery_capacity} kWh`);
        }
        doc.moveDown(1);

        // Itemized Charges
        doc.fontSize(12).text('Charges Breakdown:', { underline: true });
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const itemHeight = 20;
        let currentY = tableTop;

        // Table Header
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Description', 50, currentY);
        doc.text('Amount', 400, currentY, { align: 'right' });
        currentY += itemHeight;

        // Draw line
        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        currentY += 10;

        // Table Rows
        doc.font('Helvetica');
        doc.text('Subscription Charge', 50, currentY);
        doc.text(formatCurrency(bill.subscription_charge), 400, currentY, { align: 'right' });
        currentY += itemHeight;

        doc.text(`Grid Energy (${bill.grid_units.toFixed(2)} units @ ₹7.5/unit)`, 50, currentY);
        doc.text(formatCurrency(bill.energy_charge), 400, currentY, { align: 'right' });
        currentY += itemHeight;

        const exportUnits = bill.export_units || (bill.grid_export || 0);
        const netMeteringCredit = bill.net_metering_credit || bill.export_credit || 0;
        doc.text(`Net Metering Credit (${exportUnits.toFixed(2)} units @ ₹5.0/unit)`, 50, currentY);
        doc.text(`-${formatCurrency(netMeteringCredit)}`, 400, currentY, { align: 'right' });
        currentY += itemHeight;
        
        if (bill.tax_amount && bill.tax_amount > 0) {
          doc.text('GST (18%)', 50, currentY);
          doc.text(formatCurrency(bill.tax_amount), 400, currentY, { align: 'right' });
        }
        currentY += itemHeight + 10;

        // Total
        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        currentY += 10;
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text('Total Amount', 50, currentY);
        doc.text(formatCurrency(bill.total_amount), 400, currentY, { align: 'right' });
        currentY += itemHeight + 20;

        // Savings & Impact
        doc.font('Helvetica').fontSize(10);
        doc.text(`Savings vs Traditional: ${formatCurrency(bill.savings_vs_traditional)}`, 50, currentY);
        currentY += itemHeight;
        doc.text(`Carbon Offset: ${bill.carbon_offset.toFixed(2)} kg CO₂`, 50, currentY);
        currentY += itemHeight;
        doc.text(`Solar Units Generated: ${bill.solar_units.toFixed(2)} kWh`, 50, currentY);
        doc.moveDown(2);

        // Payment Instructions
        doc.fontSize(12).text('Payment Instructions:', { underline: true });
        doc.fontSize(10);
        doc.text('1. Pay via UPI: upi@eaas.com');
        doc.text('2. Pay via Bank Transfer:');
        doc.text('   Account Number: 1234567890');
        doc.text('   IFSC: EAAA0001234');
        doc.text('   Bank: Energy Bank');
        doc.moveDown(1);
        doc.text('Please mention Bill Number in payment remarks.');
        doc.moveDown(2);

        // Footer
        doc.fontSize(8).text('Thank you for choosing Energy-as-a-Service!', { align: 'center' });
        doc.text('For queries, contact support@eaas.com', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new PDFService();

