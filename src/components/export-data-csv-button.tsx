import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductInventoryArray } from '@/lib/utils';

interface ExportCSVProps {
  data: ProductInventoryArray;
  filename?: string;
  fields?: string[];
  buttonText?: string;
  className?: string;
}

export default function ExportCSV({
  data,
  filename = 'export.csv',
  fields,
  buttonText = 'Export CSV',
  className = '',
}: ExportCSVProps) {
  const exportToCSV = () => {
    if (!data || !data.length) {
      console.warn('No data to export');
      return;
    }
    // Determine the fields to export
    const headersToUse = fields || Object.keys(data[0]);
    // Create CSV header row
    const headerRow = headersToUse.join(',');
    // Create CSV content rows
    const csvRows = data.map((row) => {
      return headersToUse
        .map((field) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = Object.hasOwnProperty.call(row, field) ? (row as any)[field] : undefined;
          // Handle different value types
          if (value === null || value === undefined) {
            return '';
          } else if (typeof value === 'string') {
            // Escape quotes and wrap in quotes to handle commas
            return `"${value.replace(/"/g, '""')}"`;
          } else if (value instanceof Date) {
            return `"${value.toISOString()}"`;
          } else {
            return `"${String(value)}"`;
          }
        })
        .join(',');
    });
    // Combine header and content rows
    const csvContent = [headerRow, ...csvRows].join('\n');
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    // Set up and trigger download
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={exportToCSV} className={className} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
}
