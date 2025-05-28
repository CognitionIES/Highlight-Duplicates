

export const downloadCSV = (data: any[], areaName: string) => {
  // Group data by P&ID No.
  const groupedData: { [key: string]: any[] } = {};
  data.forEach((row) => {
    if (!groupedData[row.pidNo]) {
      groupedData[row.pidNo] = [];
    }
    groupedData[row.pidNo].push(row);
  });

  // Calculate statistics
  const totalRows = data.length;
  const duplicateCount = data.filter(row => row.isDuplicate).length;
  const uniquePidCount = Object.keys(groupedData).length;
  const uniqueLineCount = new Set(data.map(row => row.lineNo)).size;

  // Create CSV content with grouped formatting
  const csvContent = [
    // Area name header
    [areaName],
    [''],
    
    // Summary statistics
    ['SUMMARY STATISTICS'],
    ['Total Rows:', totalRows],
    ['Unique P&ID Numbers:', uniquePidCount],
    ['Unique Line Numbers:', uniqueLineCount],
    ['Duplicate Line Numbers:', duplicateCount],
    [''],
    
    // Main data headers
    ['P&ID No.', 'Line No.', 'Is Duplicate']
  ];

  // Add grouped data
  Object.keys(groupedData).forEach((pidNo, groupIndex) => {
    if (groupIndex > 0) {
      csvContent.push(['']); // Empty row between groups
    }
    
    // Add rows for this P&ID without group headers
    groupedData[pidNo].forEach((row, rowIndex) => {
      csvContent.push([
        rowIndex === 0 ? pidNo : '', // Only show P&ID on first row of group
        row.lineNo,
        row.isDuplicate ? 'Yes' : 'No'
      ]);
    });
  });

  // Convert to CSV string
  const csvString = csvContent
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${areaName.replace(/[^a-z0-9]/gi, '_')}_processed.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

