
import React, { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataRow {
  pidNo: string;
  lineNo: string;
  isDuplicate: boolean;
  originalRowIndex: number;
}

interface DataTableProps {
  data: DataRow[];
}

interface GroupedData {
  pidNo: string;
  rows: DataRow[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const groupedData = useMemo(() => {
    const groups: { [key: string]: DataRow[] } = {};
    
    data.forEach((row) => {
      if (!groups[row.pidNo]) {
        groups[row.pidNo] = [];
      }
      groups[row.pidNo].push(row);
    });
    
    return Object.keys(groups).map(pidNo => ({
      pidNo,
      rows: groups[pidNo]
    }));
  }, [data]);

  const duplicateLineNos = useMemo(() => {
    const lineNoCount: { [key: string]: number } = {};
    
    // Count occurrences of each Line No.
    data.forEach((row) => {
      lineNoCount[row.lineNo] = (lineNoCount[row.lineNo] || 0) + 1;
    });
    
    // Return set of Line No.s that appear more than once
    return new Set(
      Object.keys(lineNoCount).filter(lineNo => lineNoCount[lineNo] > 1)
    );
  }, [data]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <ScrollArea className="h-[600px]">
        <table className="w-full">
          <thead className="bg-gray-50 border-b sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-16">
                Row
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                P&ID No.
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Line No.
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {groupedData.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.rows.map((row, rowIndex) => (
                  <tr key={`${groupIndex}-${rowIndex}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {row.originalRowIndex + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {rowIndex === 0 ? row.pidNo : ''}
                    </td>
                    <td 
                      className={`px-4 py-3 text-sm text-gray-900 transition-colors ${
                        row.isDuplicate
                          ? 'bg-green-100 font-medium border-l-4 border-green-500' 
                          : ''
                      }`}
                    >
                      {row.lineNo}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </ScrollArea>
      
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No data to display
        </div>
      )}
      
      <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
        Showing {data.length} rows
        {duplicateLineNos.size > 0 && (
          <span className="ml-4">
            • <span className="inline-block w-3 h-3 bg-green-100 border border-green-500 mr-1"></span>
            Duplicate Line No. entries highlighted in green
          </span>
        )}
      </div>
    </div>
  );
};

export default DataTable;
