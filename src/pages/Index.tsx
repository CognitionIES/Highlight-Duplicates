
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import DataTable from '@/components/DataTable';
import { processFileData, ProcessedData } from '@/utils/dataProcessor';
import { downloadCSV } from '@/utils/csvExporter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Database, AlertCircle, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      console.log('Processing file:', file.name);
      const result = await processFileData(file);
      setProcessedData(result);
      
      toast({
        title: "File processed successfully",
        description: `Processed ${result.data.length} rows with ${result.duplicateCount} duplicate Line No. entries found.`,
      });
      
      console.log('Processing complete:', {
        totalRows: result.data.length,
        duplicates: result.duplicateCount,
        areaName: result.areaName
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Please check your file format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setProcessedData(null);
    setShowOnlyDuplicates(false);
  };

  const handleDownloadCSV = () => {
    if (processedData) {
      const dataToDownload = showOnlyDuplicates 
        ? processedData.data.filter(row => row.isDuplicate)
        : processedData.data;
      
      downloadCSV(dataToDownload, processedData.areaName);
      toast({
        title: "CSV downloaded",
        description: showOnlyDuplicates 
          ? "Duplicate entries have been downloaded as a CSV file."
          : "Your processed data has been downloaded as a CSV file.",
      });
    }
  };

  const toggleDuplicateFilter = () => {
    setShowOnlyDuplicates(!showOnlyDuplicates);
  };

  const filteredData = processedData && showOnlyDuplicates 
    ? processedData.data.filter(row => row.isDuplicate)
    : processedData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              P&ID Line Data Processor
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload Excel or CSV files to process P&ID and Line No. data with intelligent grouping and duplicate detection
          </p>
        </div>

        {!processedData ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-300">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  <Database className="h-5 w-5" />
                  Upload Your Data File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  onFileUpload={handleFileUpload} 
                  isProcessing={isProcessing}
                />
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-2">Expected File Format:</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• First row: Area name (e.g., "055 LINE LIST")</li>
                        <li>• Column A: P&ID No. (may have empty cells)</li>
                        <li>• Column B: Line No.</li>
                        <li>• Empty P&ID cells will be filled with the last non-empty value</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {showOnlyDuplicates ? filteredData.length : processedData.data.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {showOnlyDuplicates ? 'Duplicate Rows' : 'Total Rows'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{processedData.duplicateCount}</div>
                  <div className="text-sm text-gray-600">Duplicate Line No.</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(processedData.data.map(row => row.pidNo)).size}
                  </div>
                  <div className="text-sm text-gray-600">Unique P&ID No.</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-lg font-bold text-gray-800 truncate" title={processedData.areaName}>
                    {processedData.areaName}
                  </div>
                  <div className="text-sm text-gray-600">Area Name</div>
                </CardContent>
              </Card>
            </div>

            {/* Data Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Processed Data</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={toggleDuplicateFilter}
                    variant={showOnlyDuplicates ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {showOnlyDuplicates ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {showOnlyDuplicates ? 'Show All' : 'Show Duplicates Only'}
                  </Button>
                  <Button
                    onClick={handleDownloadCSV}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Upload New File
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable data={filteredData} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
