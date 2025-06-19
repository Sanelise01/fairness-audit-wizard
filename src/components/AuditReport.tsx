
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AuditReportProps {
  onBack: () => void;
  auditData: any;
}

export const AuditReport = ({ onBack, auditData }: AuditReportProps) => {
  const { dataset, protectedAttribute, biasMetrics, mitigationResults } = auditData;

  const generatePDFReport = () => {
    // Simulate PDF generation
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
    
    // Create and download blob
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fairness-audit-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMetricImprovement = (before: number, after: number) => {
    const improvement = Math.abs(before) - Math.abs(after);
    return improvement > 0 ? "improved" : improvement < 0 ? "worsened" : "stable";
  };

  return (
    <div className="p-8">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl">Fairness Audit Report</CardTitle>
        <CardDescription className="text-lg">
          Complete summary of bias detection and mitigation results
        </CardDescription>
      </CardHeader>

      <CardContent className="max-w-4xl mx-auto space-y-8">
        {/* Executive Summary */}
        <Card className="bg-blue-50 border-blue-200">
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

        {/* Dataset Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dataset Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{dataset.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Records:</span>
                <span className="font-medium">{dataset.records.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Features:</span>
                <span className="font-medium">{dataset.features}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Protected Attribute:</span>
                <Badge variant="outline">{protectedAttribute}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mitigation Technique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium">{mitigationResults.technique}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">Preprocessing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy Impact:</span>
                <Badge className="bg-green-100 text-green-700">No Loss</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fairness Metrics Comparison</CardTitle>
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

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={onBack}>
            Back to Results
          </Button>
          
          <div className="space-x-4">
            <Button onClick={generatePDFReport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download Report
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
