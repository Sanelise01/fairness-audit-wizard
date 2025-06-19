
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MitigationResultsProps {
  onNext: () => void;
  onBack: () => void;
  auditData: any;
  setAuditData: (data: any) => void;
}

export const MitigationResults = ({ onNext, onBack, auditData, setAuditData }: MitigationResultsProps) => {
  const [mitigationProgress, setMitigationProgress] = useState(0);
  const [isMitigating, setIsMitigating] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Simulate mitigation progress
    const interval = setInterval(() => {
      setMitigationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMitigating(false);
          
          // Simulate improved metrics after reweighing (from your notebook)
          const mitigationResults = {
            technique: "Reweighing",
            before: auditData.biasMetrics,
            after: {
              statisticalParity: -0.091,
              disparateImpact: 0.581,
              equalOpportunity: 0.120,
              accuracy: 0.8448,
            },
            improvements: {
              statisticalParity: 0.097, // |before| - |after|
              disparateImpact: 0.300,   // after - before
              equalOpportunity: 0.253,  // improvement in absolute terms
            }
          };
          
          setResults(mitigationResults);
          setAuditData({
            ...auditData,
            mitigationResults: mitigationResults,
          });
          
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (isMitigating) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Applying Bias Mitigation</CardTitle>
            <CardDescription className="text-lg">
              Using Reweighing technique to reduce detected bias
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="w-24 h-24 mx-auto mb-6">
              <svg className="animate-spin w-full h-full text-green-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Mitigation Progress</span>
                <span>{Math.round(mitigationProgress)}%</span>
              </div>
              <Progress value={mitigationProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>✓ Applying reweighing algorithm</div>
              <div>✓ Retraining model</div>
              <div>✓ Calculating new metrics</div>
              <div>✓ Validating improvements</div>
            </div>
          </CardContent>
        </div>
      </div>
    );
  }

  const comparisonData = [
    {
      metric: "Statistical Parity",
      before: Math.abs(results.before.statisticalParity),
      after: Math.abs(results.after.statisticalParity),
      improvement: results.improvements.statisticalParity > 0,
    },
    {
      metric: "Disparate Impact",
      before: results.before.disparateImpact,
      after: results.after.disparateImpact,
      improvement: results.improvements.disparateImpact > 0,
    },
    {
      metric: "Equal Opportunity",
      before: Math.abs(results.before.equalOpportunity),
      after: Math.abs(results.after.equalOpportunity),
      improvement: results.improvements.equalOpportunity > 0,
    },
  ];

  return (
    <div className="p-8">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl">Bias Mitigation Results</CardTitle>
        <CardDescription className="text-lg">
          Fairness improvements achieved using {results.technique}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800">Bias Successfully Reduced!</h3>
          <p className="text-green-700">The reweighing technique improved fairness across multiple metrics.</p>
        </div>

        {/* Before/After Comparison */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Before vs After Comparison</h3>
          
          {comparisonData.map((item) => (
            <div key={item.metric} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">{item.metric}</span>
                {item.improvement ? (
                  <Badge className="bg-green-100 text-green-700">IMPROVED</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700">STABLE</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{item.before.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">Before</div>
                </div>
                
                <div className="text-center">
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{item.after.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">After</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Visualization */}
        <div className="h-64">
          <h3 className="text-lg font-semibold mb-4">Metrics Comparison Chart</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="before" fill="#EF4444" name="Before Mitigation" />
              <Bar dataKey="after" fill="#10B981" name="After Mitigation" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Model Performance */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{results.after.accuracy}</div>
                <div className="text-sm text-gray-600">Maintained Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm text-gray-600">No Performance Loss</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            Back to Analysis
          </Button>
          <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
            Generate Report
          </Button>
        </div>
      </CardContent>
    </div>
  );
};
