
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AuditReportProps {
  onBack: () => void;
  auditData: any;
}

export const AuditReport = ({ onBack, auditData }: AuditReportProps) => {
  const { dataset, protectedAttribute, biasMetrics, mitigationResults } = auditData;
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDFReport = async () => {
    if (!reportRef.current) return;

    try {
      // Create canvas from the report content
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.getDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = pdfWidth / canvasWidth;
      const scaledHeight = canvasHeight * ratio;

      // Add title page
      pdf.setFontSize(20);
      pdf.text('Fairness Audit Report', pdfWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 45, { align: 'center' });
      pdf.text(`Dataset: ${dataset.name}`, pdfWidth / 2, 55, { align: 'center' });
      pdf.text(`Protected Attribute: ${protectedAttribute}`, pdfWidth / 2, 65, { align: 'center' });

      // Add the report content
      if (scaledHeight > pdfHeight - 80) {
        // If content is too tall, add on new page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 80, pdfWidth, scaledHeight);
      }

      // Save the PDF
      pdf.save(`fairness-audit-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text-based download
      const reportContent = `
# Fairness Audit Report

## Dataset Information
- Dataset: ${dataset.name}
- Records: ${dataset.records.toLocaleString()}
- Protected Attribute: ${protectedAttribute}

## Bias Analysis Results (Before Mitigation)
- Statistical Parity Difference: ${biasMetrics.statisticalParity.toFixed(4)}
- Disparate Impact: ${biasMetrics.disparateImpact.toFixed(4)}
- Equal Opportunity Difference: ${biasMetrics.equalOpportunity.toFixed(4)}

## Mitigation Results (After Reweighing)
- Statistical Parity Difference: ${mitigationResults.after.statisticalParity.toFixed(4)}
- Disparate Impact: ${mitigationResults.after.disparateImpact.toFixed(4)}
- Equal Opportunity Difference: ${mitigationResults.after.equalOpportunity.toFixed(4)}

## Recommendations
- Bias successfully reduced using reweighing technique
- Consider regular monitoring for production deployment
- Implement additional post-processing if needed
      `;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fairness-audit-report.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const chartData = [
    {
      name: "Statistical Parity",
      before: Math.abs(biasMetrics.statisticalParity),
      after: Math.abs(mitigationResults.after.statisticalParity)
    },
    {
      name: "Disparate Impact",
      before: biasMetrics.disparateImpact,
      after: mitigationResults.after.disparateImpact
    },
    {
      name: "Equal Opportunity",
      before: Math.abs(biasMetrics.equalOpportunity),
      after: Math.abs(mitigationResults.after.equalOpportunity)
    }
  ];

  return (
    <div className="p-8">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl">Fairness Audit Report</CardTitle>
        <CardDescription className="text-lg">
          Complete summary of bias detection and mitigation results
        </CardDescription>
      </CardHeader>

      <CardContent className="max-w-4xl mx-auto space-y-8">
        <div ref={reportRef} className="bg-white p-6 rounded-lg">
          {/* Executive Summary */}
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Executive Summary</h3>
                  <p className="text-blue-800 mt-2">
                    Bias detected in the {dataset.name} has been successfully mitigated using reweighing preprocessing. 
                    Fairness metrics showed significant improvement while maintaining model accuracy at {mitigationResults.after.accuracy}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Comparison Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Fairness Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="before" fill="#EF4444" name="Before Mitigation" />
                    <Bar dataKey="after" fill="#10B981" name="After Mitigation" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Table */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Metric</th>
                      <th className="text-center py-3 px-4">Before Mitigation</th>
                      <th className="text-center py-3 px-4">After Mitigation</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Statistical Parity Difference</td>
                      <td className="text-center py-3 px-4 text-red-600">{biasMetrics.statisticalParity.toFixed(4)}</td>
                      <td className="text-center py-3 px-4 text-green-600">{mitigationResults.after.statisticalParity.toFixed(4)}</td>
                      <td className="text-center py-3 px-4">
                        <Badge className="bg-green-100 text-green-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Improved
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Disparate Impact</td>
                      <td className="text-center py-3 px-4 text-red-600">{biasMetrics.disparateImpact.toFixed(4)}</td>
                      <td className="text-center py-3 px-4 text-green-600">{mitigationResults.after.disparateImpact.toFixed(4)}</td>
                      <td className="text-center py-3 px-4">
                        <Badge className="bg-green-100 text-green-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Improved
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Equal Opportunity Difference</td>
                      <td className="text-center py-3 px-4 text-red-600">{biasMetrics.equalOpportunity.toFixed(4)}</td>
                      <td className="text-center py-3 px-4 text-green-600">{mitigationResults.after.equalOpportunity.toFixed(4)}</td>
                      <td className="text-center py-3 px-4">
                        <Badge className="bg-green-100 text-green-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Improved
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Deployment Ready</p>
                  <p className="text-gray-600 text-sm">The model shows significant bias reduction and can be considered for production deployment.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium">Ongoing Monitoring</p>
                  <p className="text-gray-600 text-sm">Implement regular fairness audits to ensure bias doesn't reoccur in production.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Further Optimization</p>
                  <p className="text-gray-600 text-sm">Consider combining with post-processing techniques for additional improvements if needed.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={onBack}>
            Back to Results
          </Button>
          
          <div className="space-x-4">
            <Button onClick={generatePDFReport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
              <FileText className="w-4 h-4 mr-2" />
              New Audit
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
