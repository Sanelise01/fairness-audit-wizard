
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, CheckCircle, Users, Shield } from "lucide-react";
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
  const [affectedGroups, setAffectedGroups] = useState(null);

  useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          // Comprehensive bias metrics including additional fairness measures
          const metrics = {
            statisticalParity: -0.188,
            disparateImpact: 0.281,
            equalOpportunity: -0.133,
            equalisedOdds: -0.142,
            calibration: 0.085,
            conditionalParity: -0.096,
            accuracy: 0.8448,
            demographicParity: -0.205,
            predictiveRateCorrection: 0.078,
          };

          // Affected demographic groups analysis
          const demographicGroups = {
            primaryAttribute: auditData.protectedAttribute || "gender",
            groups: [
              {
                name: "Female",
                populationPercentage: 52.3,
                impactLevel: "high",
                negativeOutcomeRate: 0.284,
                positiveOutcomeRate: 0.716,
                biasScore: -0.188,
                recommendations: ["Increase representation in training data", "Apply targeted reweighing"]
              },
              {
                name: "Male", 
                populationPercentage: 47.7,
                impactLevel: "low",
                negativeOutcomeRate: 0.156,
                positiveOutcomeRate: 0.844,
                biasScore: 0.188,
                recommendations: ["Monitor for overcorrection", "Ensure balanced evaluation metrics"]
              }
            ],
            intersectionalAnalysis: [
              {
                combination: "Female + Age 18-25",
                impactLevel: "critical",
                biasScore: -0.245,
                populationSize: "12.4%"
              },
              {
                combination: "Female + Age 50+",
                impactLevel: "high", 
                biasScore: -0.198,
                populationSize: "15.7%"
              },
              {
                combination: "Male + Age 25-35",
                impactLevel: "medium",
                biasScore: 0.089,
                populationSize: "18.2%"
              }
            ]
          };
          
          setBiasMetrics(metrics);
          setAffectedGroups(demographicGroups);
          setAuditData({
            ...auditData,
            biasMetrics: metrics,
            affectedGroups: demographicGroups,
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
      case "critical": return "text-red-800 bg-red-200";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "high": case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <TrendingUp className="w-4 h-4" />;
      case "low": return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-800 bg-red-200 border-red-400";
      case "high": return "text-red-600 bg-red-100 border-red-300";
      case "medium": return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "low": return "text-green-600 bg-green-100 border-green-300";
      default: return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  if (isAnalyzing) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white">Analyzing Dataset for Bias</CardTitle>
            <CardDescription className="text-lg text-purple-200">
              Running comprehensive fairness metrics on {auditData.dataset?.name}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="w-24 h-24 mx-auto mb-6">
              <svg className="animate-spin w-full h-full text-purple-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-purple-200">
                <span>Analysis Progress</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-4 bg-purple-900/50" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-purple-200 font-semibold">
              <div>✓ Loading dataset</div>
              <div>✓ Identifying protected groups</div>
              <div>✓ Calculating statistical parity</div>
              <div>✓ Computing disparate impact</div>
              <div>✓ Measuring equalised odds</div>
              <div>✓ Evaluating calibration</div>
              <div>✓ Analyzing demographic parity</div>
              <div>✓ Computing conditional parity</div>
            </div>
          </CardContent>
        </div>
      </div>
    );
  }

  const primaryMetrics = [
    { name: "Statistical Parity", value: Math.abs(biasMetrics.statisticalParity), status: getMetricStatus(biasMetrics.statisticalParity, "statistical") },
    { name: "Disparate Impact", value: biasMetrics.disparateImpact, status: getMetricStatus(biasMetrics.disparateImpact, "disparateImpact") },
    { name: "Equal Opportunity", value: Math.abs(biasMetrics.equalOpportunity), status: getMetricStatus(biasMetrics.equalOpportunity, "equal") },
    { name: "Equalised Odds", value: Math.abs(biasMetrics.equalisedOdds), status: getMetricStatus(biasMetrics.equalisedOdds, "equal") },
  ];

  const secondaryMetrics = [
    { name: "Calibration", value: Math.abs(biasMetrics.calibration), status: getMetricStatus(biasMetrics.calibration, "calibration") },
    { name: "Conditional Parity", value: Math.abs(biasMetrics.conditionalParity), status: getMetricStatus(biasMetrics.conditionalParity, "conditional") },
    { name: "Demographic Parity", value: Math.abs(biasMetrics.demographicParity), status: getMetricStatus(biasMetrics.demographicParity, "demographic") },
    { name: "Predictive Rate Correction", value: Math.abs(biasMetrics.predictiveRateCorrection), status: getMetricStatus(biasMetrics.predictiveRateCorrection, "predictive") },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-slate-800/90 to-purple-900/90 min-h-full">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-black text-white tracking-wide">Bias Analysis Results</CardTitle>
        <CardDescription className="text-lg text-purple-200 font-semibold">
          Comprehensive fairness metrics detected for {auditData.protectedAttribute} attribute
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Affected Demographic Groups Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-black text-white tracking-wide">AFFECTED DEMOGRAPHIC GROUPS</h3>
          </div>
          
          {/* Primary Groups Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {affectedGroups.groups.map((group, index) => (
              <Card key={index} className={`bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-2 ${getImpactColor(group.impactLevel)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-white text-lg tracking-wide">{group.name}</h4>
                    <Badge className={`${getImpactColor(group.impactLevel)} font-black tracking-wide`}>
                      {group.impactLevel.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-200 font-bold">Population:</span>
                      <span className="text-white font-black">{group.populationPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200 font-bold">Bias Score:</span>
                      <span className={`font-black ${group.biasScore < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {group.biasScore.toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200 font-bold">Negative Outcomes:</span>
                      <span className="text-white font-black">{(group.negativeOutcomeRate * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="text-sm font-black text-purple-200 mb-2">RECOMMENDATIONS:</h5>
                      <ul className="text-xs text-purple-300 space-y-1">
                        {group.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <Shield className="w-3 h-3 mt-0.5 text-purple-400" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Intersectional Analysis */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white tracking-wide">INTERSECTIONAL BIAS ANALYSIS</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {affectedGroups.intersectionalAnalysis.map((intersection, index) => (
                <div key={index} className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-purple-500/30 rounded-lg p-4 backdrop-blur-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-200 text-sm">{intersection.combination}</span>
                    <Badge className={`${getImpactColor(intersection.impactLevel)} text-xs font-bold`}>
                      {intersection.impactLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-300">Population:</span>
                      <span className="text-white font-bold">{intersection.populationSize}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-300">Bias Score:</span>
                      <span className={`font-bold ${intersection.biasScore < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {intersection.biasScore.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-400">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-black text-white">{biasMetrics.accuracy}</div>
              <div className="text-sm text-blue-200 font-bold">Model Accuracy</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-900 to-red-800 border-red-400">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-black text-white">{Math.abs(biasMetrics.statisticalParity).toFixed(3)}</div>
              <div className="text-sm text-red-200 font-bold">Statistical Parity</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-yellow-400">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-black text-white">{biasMetrics.disparateImpact.toFixed(3)}</div>
              <div className="text-sm text-yellow-200 font-bold">Disparate Impact</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-400">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-black text-white">{Math.abs(biasMetrics.equalisedOdds).toFixed(3)}</div>
              <div className="text-sm text-purple-200 font-bold">Equalised Odds</div>
            </CardContent>
          </Card>
        </div>

        {/* Primary Fairness Metrics */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white tracking-wide">PRIMARY FAIRNESS METRICS</h3>
          {primaryMetrics.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-purple-500/30 rounded-lg backdrop-blur-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(metric.status)}
                <span className="font-black text-white tracking-wide">{metric.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-black text-white">{metric.value.toFixed(3)}</span>
                <Badge className={`${getStatusColor(metric.status)} font-black tracking-wide`}>
                  {metric.status.toUpperCase()} BIAS
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Fairness Metrics */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white tracking-wide">ADDITIONAL FAIRNESS METRICS</h3>
          {secondaryMetrics.map((metric) => (
            <div key={metric.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-purple-500/20 rounded-lg backdrop-blur-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(metric.status)}
                <span className="font-bold text-purple-200">{metric.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-purple-200">{metric.value.toFixed(3)}</span>
                <Badge className={`${getStatusColor(metric.status)} font-bold`}>
                  {metric.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="h-80 bg-gradient-to-br from-slate-800/60 to-purple-900/60 rounded-lg p-4 border border-purple-500/30">
          <h3 className="text-lg font-black text-white mb-4 tracking-wide">BIAS SEVERITY VISUALIZATION</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={primaryMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8B5CF6" />
              <XAxis dataKey="name" stroke="#E5E7EB" fontSize={12} fontWeight="bold" />
              <YAxis stroke="#E5E7EB" fontSize={12} fontWeight="bold" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #8B5CF6',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="value" fill="url(#biasGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="biasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack} className="bg-slate-800 border-purple-500 text-purple-200 hover:bg-slate-700 font-bold">
            Back to Dataset
          </Button>
          <Button onClick={onNext} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black tracking-wide shadow-lg">
            Apply Bias Mitigation
          </Button>
        </div>
      </CardContent>
    </div>
  );
};
