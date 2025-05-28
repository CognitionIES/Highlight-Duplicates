
import * as XLSX from 'xlsx';

export interface DataRow {
  pidNo: string;
  lineNo: string;
  isDuplicate: boolean;
  originalRowIndex: number;
}

export interface ProcessedData {
  data: DataRow[];
  areaName: string;
  duplicateCount: number;
}

export const processFileData = async (file: File): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let workbook: XLSX.WorkBook;
        
        if (file.name.toLowerCase().endsWith('.csv')) {
          // Handle CSV files
          workbook = XLSX.read(data, { type: 'binary' });
        } else {
          // Handle Excel files
          workbook = XLSX.read(data, { type: 'array' });
        }
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: ''
        }) as string[][];
        
        console.log('Raw data loaded:', rawData.length, 'rows');
        
        if (rawData.length < 2) {
          throw new Error('File must contain at least 2 rows (header + data)');
        }
        
        // Extract area name from first row
        const areaName = extractAreaName(rawData[0]);
        console.log('Area name extracted:', areaName);
        
        // Process data starting from second row (skip area name row)
        const processedRows = processRows(rawData.slice(1));
        console.log('Processed rows:', processedRows.length);
        
        // Mark duplicates and count them
        const { data: markedData, duplicateCount } = markDuplicates(processedRows);
        console.log('Duplicate count:', duplicateCount);
        
        resolve({
          data: markedData,
          areaName,
          duplicateCount
        });
        
      } catch (error) {
        console.error('Error processing file:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

const extractAreaName = (firstRow: string[]): string => {
  // Find the first non-empty cell in the first row
  const areaName = firstRow.find(cell => cell && typeof cell === 'string' && cell.trim().length > 0);
  return areaName?.trim() || 'Unknown Area';
};

const processRows = (rows: string[][]): DataRow[] => {
  const processedRows: DataRow[] = [];
  let currentPidNo = '';
  
  rows.forEach((row, index) => {
    // Skip completely empty rows
    if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
      return;
    }
    
    const pidNoCell = row[0]?.toString().trim() || '';
    const lineNoCell = row[1]?.toString().trim() || '';
    
    // Skip rows without Line No.
    if (!lineNoCell) {
      return;
    }
    
    // Update current P&ID No. if this row has one
    if (pidNoCell) {
      currentPidNo = pidNoCell;
    }
    
    // Only add rows that have a Line No. and a P&ID No. (current or inherited)
    if (currentPidNo && lineNoCell) {
      processedRows.push({
        pidNo: currentPidNo,
        lineNo: lineNoCell,
        isDuplicate: false, // Will be calculated in markDuplicates
        originalRowIndex: index + 1 // +1 because we skipped the first row
      });
    }
  });
  
  return processedRows;
};

const markDuplicates = (rows: DataRow[]): { data: DataRow[], duplicateCount: number } => {
  const lineNoOccurrences: { [key: string]: number[] } = {};
  
  // Find all occurrences of each Line No.
  rows.forEach((row, index) => {
    if (!lineNoOccurrences[row.lineNo]) {
      lineNoOccurrences[row.lineNo] = [];
    }
    lineNoOccurrences[row.lineNo].push(index);
  });
  
  // Mark duplicates (all occurrences except the first one)
  let duplicateCount = 0;
  const markedData = rows.map((row, index) => {
    const occurrences = lineNoOccurrences[row.lineNo];
    const isFirstOccurrence = occurrences[0] === index;
    const isDuplicate = occurrences.length > 1 && !isFirstOccurrence;
    
    if (isDuplicate) {
      duplicateCount++;
    }
    
    return {
      ...row,
      isDuplicate
    };
  });
  
  return { data: markedData, duplicateCount };
};
