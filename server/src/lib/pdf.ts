import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  dueDate: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    company?: string | null;
    address?: string | null;
  };
  items: Array<{
    description: string;
    amount: number;
    taxRate: number;
  }>;
}

export async function generateInvoicePdf(invoice: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      // Company Info (Top Left)
      doc.fontSize(20).font('Helvetica-Bold').text('BYTEVELL', 50, 57);
      doc.fontSize(10).font('Helvetica').text('123 Infrastructure Ave.', 50, 80);
      doc.text('Cloud City, CC 94103', 50, 95);
      doc.text('support@bytevell.com', 50, 110);

      // Invoice Details (Top Right)
      doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', 0, 50, { align: 'right' });
      doc.fontSize(10).font('Helvetica-Bold').text(`Invoice #: ${invoice.invoiceNumber}`, 0, 80, { align: 'right' });
      doc.font('Helvetica').text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 0, 95, { align: 'right' });
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 0, 110, { align: 'right' });
      
      const statusColor = invoice.status === 'paid' ? '#10b981' : (invoice.status === 'overdue' ? '#ef4444' : '#f59e0b');
      doc.fillColor(statusColor).text(`Status: ${invoice.status.toUpperCase()}`, 0, 125, { align: 'right' });
      doc.fillColor('#000000');

      doc.moveDown(3);

      // Customer Details
      doc.font('Helvetica-Bold').text('Billed To:', 50, 160);
      doc.font('Helvetica').text(invoice.customer.name, 50, 175);
      if (invoice.customer.company) {
        doc.text(invoice.customer.company, 50, 190);
        if (invoice.customer.address) doc.text(invoice.customer.address, 50, 205);
      } else if (invoice.customer.address) {
        doc.text(invoice.customer.address, 50, 190);
      }

      // Line Items Table Header
      const tableTop = 260;
      doc.font('Helvetica-Bold');
      generateTableRow(doc, tableTop, 'Description', 'Tax Rate', 'Amount');
      generateHr(doc, tableTop + 20);
      doc.font('Helvetica');

      // Line Items
      let i = 0;
      let y = tableTop + 30;
      for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        generateTableRow(
          doc,
          y,
          item.description,
          `${item.taxRate}%`,
          formatCurrency(item.amount, invoice.currency)
        );
        generateHr(doc, y + 20);
        y += 30;
      }

      // Totals
      const summaryStartX = 350;
      const totalsTop = y + 20;
      doc.font('Helvetica');
      doc.text('Subtotal:', summaryStartX, totalsTop);
      doc.text(formatCurrency(invoice.subtotal, invoice.currency), 0, totalsTop, { align: 'right' });
      
      doc.text('Tax:', summaryStartX, totalsTop + 20);
      doc.text(formatCurrency(invoice.tax, invoice.currency), 0, totalsTop + 20, { align: 'right' });

      doc.font('Helvetica-Bold');
      doc.text('Total:', summaryStartX, totalsTop + 40);
      doc.text(formatCurrency(invoice.total, invoice.currency), 0, totalsTop + 40, { align: 'right' });

      // Footer
      doc.font('Helvetica').fontSize(10);
      doc.text(
        'Payment is due within 14 days. Thank you for your business!',
        50,
        700,
        { align: 'center', width: 500 }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function generateTableRow(doc: PDFKit.PDFDocument, y: number, item: string, tax: string, amount: string) {
  doc.fontSize(10)
    .text(item, 50, y, { width: 300 })
    .text(tax, 370, y, { width: 90, align: 'right' })
    .text(amount, 0, y, { align: 'right' });
}

function generateHr(doc: PDFKit.PDFDocument, y: number) {
  doc.strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
