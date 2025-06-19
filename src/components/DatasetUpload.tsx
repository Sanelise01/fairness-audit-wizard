
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DatasetUploadProps {
  onNext: () => void;
  auditData: any;
  setAuditData: (data: any) => void;
}

export const DatasetUpload = ({ onNext, auditData, setAuditData }: DatasetUploadProps) => {
  const [selectedDataset, setSelectedDataset] = useState("adult");
  const [protectedAttribute, setProtectedAttribute] = useState("sex");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSelectedDataset("custom");
      setIsUploading(true);
      
      // Simulate file processing
      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    }
  };

  const handleNext = () => {
    let sampleData;
    
    if (uploadedFile) {
      sampleData = {
        name: uploadedFile.name,
        records: Math.floor(Math.random() * 50000) + 10000,
        features: Math.floor(Math.random() * 20) + 5,
        protectedAttribute: protectedAttribute,
      };
    } else {
      sampleData = {
        name: selectedDataset === "adult" ? "UCI Adult Income Dataset" : "Custom Dataset",
        records: selectedDataset === "adult" ? 48842 : 0,
        features: selectedDataset === "adult" ? 14 : 0,
        protectedAttribute: protectedAttribute,
      };
    }

    setAuditData({
      ...auditData,
      dataset: sampleData,
      protectedAttribute: protectedAttribute,
    });

    onNext();
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl">Upload Your Dataset</CardTitle>
          <CardDescription className="text-lg">
            Start your fairness audit by selecting a dataset and defining protected attributes
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-3">
            <Label htmlFor="file-upload" className="text-base font-medium">Upload Custom Dataset</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-gray-600 mb-2">Drop your CSV file here or click to browse</p>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Processing..." : "Choose File"}
                </Button>
              </div>
            </div>
            
            {uploadedFile && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>File uploaded:</strong> {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Sample Dataset Selection */}
          <div className="space-y-3">
            <Label htmlFor="dataset" className="text-base font-medium">Or Choose Sample Dataset</Label>
            <Select value={selectedDataset} onValueChange={setSelectedDataset}>
              <SelectTrigger>
                <SelectValue placeholder="Select a dataset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">UCI Adult Income Dataset (Sample)</SelectItem>
                <SelectItem value="custom">Custom Dataset (Upload Above)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Protected Attribute Selection */}
          <div className="space-y-3">
            <Label htmlFor="attribute" className="text-base font-medium">Protected Attribute</Label>
            <Select value={protectedAttribute} onValueChange={setProtectedAttribute}>
              <SelectTrigger>
                <SelectValue placeholder="Select protected attribute" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sex">Sex/Gender</SelectItem>
                <SelectItem value="race">Race</SelectItem>
                <SelectItem value="age">Age Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dataset Preview */}
          {selectedDataset === "adult" && !uploadedFile && (
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                <strong>UCI Adult Dataset Preview:</strong><br />
                • 48,842 records with 14 features<br />
                • Prediction task: Income level (≤50K or &gt;50K)<br />
                • Protected attributes: Sex, Race, Age<br />
                • Commonly used for fairness research
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleNext} 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!selectedDataset || !protectedAttribute || isUploading}
            >
              Start Bias Analysis
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
};
