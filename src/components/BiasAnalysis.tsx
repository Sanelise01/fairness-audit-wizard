
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BiasAnalysisProps {
  onNext: () => void;
  onBack: () => void;
  auditData: any;
  setAuditData: (data: any) => void;
}

export const BiasAnalysis = ({ onNext, onBack, auditData, setAuditData }: BiasAnalysisProps) => {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [biasMetrics, setBiasMetrics] = useState(null);

  useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          // Simulate bias detection results (based on your notebook)
          const metrics = {
            statisticalParity: -0.188,
            disparateImpact: 0.281,
            equalOpportunity: -0.133,
            accuracy: 0.8448,
          };
          
          setBiasMetrics(metrics);
          setAuditData({
            ...auditData,
            biasMetrics: metrics,
          });
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const getMetricStatus = (value: number, type: string) => {
    if (type === "disparateImpact") {
      if (value < 0.8 || value > 1.2) return "high";
      if (value < 0.9 || value > 1.1) return "medium";
      return "low";
    } else {
      const absValue = Math.abs(value);
      if (absValue > 0.1) return "high";
      if (absValue > 0.05) return "medium";
      return "low";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <TrendingUp className="w-4 h-4" />;
      case "low": return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Analyzing Dataset for Bias</CardTitle>
            <CardDescription className="text-lg">
              Running comprehensive fairness metrics on {auditData.dataset?.name}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="w-24 h-24 mx-auto mb-6">
              <svg className="animate-spin w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Analysis Progress</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>✓ Loading dataset</div>
              <div>✓ Identifying protected groups</div>
              <div>✓ Calculating statistical parity</div>
              <div>✓ Computing disparate impact</div>
            </div>
          </CardContent>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "Statistical Parity", value: Math.abs(biasMetrics.statisticalParity), status: getMetricStatus(biasMetrics.statisticalParity, "statistical") },
    { name: "Disparate Impact", value: biasMetrics.disparateImpact, status: getMetricStatus(biasMetrics.disparateImpact, "disparateImpact") },
    { name: "Equal Opportunity", value: Math.abs(biasMetrics.equalOpportunity), status: getMetricStatus(biasMetrics.equalOpportunity, "equal") },
  ];

  return (
    <div className="p-8">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl">Bias Analysis Results</CardTitle>
        <CardDescription className="text-lg">
          Fairness metrics detected for {auditData.protectedAttribute} attribute
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">{biasMetrics.accuracy}</div>
              <div className="text-sm text-gray-600">Model Accuracy</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{Math.abs(biasMetrics.statisticalParity).toFixed(3)}</div>
              <div className="text-sm text-gray-600">Statistical Parity Diff</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">{biasMetrics.disparateImpact.toFixed(3)}</div>
              <div className="text-sm text-gray-600">Disparate Impact</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detailed Fairness Metrics</h3>
          {chartData.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(metric.status)}
                <span className="font-medium">{metric.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">{metric.value.toFixed(3)}</span>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status.toUpperCase()} BIAS
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            Back to Dataset
          </Button>
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
            Apply Bias Mitigation
          </Button>
        </div>
      </CardContent>
    </div>
  );
};
