
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, ArrowRight, Settings, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface MitigationResultsProps {
  onNext: () => void;
  onBack: () => void;
  auditData: any;
  setAuditData: (data: any) => void;
}

export const MitigationResults = ({ onNext, onBack, auditData, setAuditData }: MitigationResultsProps) => {
  const [mitigationProgress, setMitigationProgress] = useState(0);
  const [isMitigating, setIsMitigating] = useState(true);
  const [currentTechnique, setCurrentTechnique] = useState("Reweighing");
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Simulate mitigation progress with multiple techniques
    const techniques = ["Reweighing", "Adversarial Debiasing", "Fairness Constraints"];
    let techniqueIndex = 0;
    
    const interval = setInterval(() => {
      setMitigationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMitigating(false);
          
          // Simulate improved metrics after applying multiple mitigation techniques
          const mitigationResults = {
            techniques: [
              {
                name: "Reweighing",
                type: "Pre-processing",
                description: "Adjusts training data weights to ensure fairness"
              },
              {
                name: "Adversarial Debiasing", 
                type: "In-processing",
                description: "Uses adversarial training to remove bias during model training"
              },
              {
                name: "Fairness Constraints",
                type: "In-processing", 
                description: "Applies fairness constraints during optimization"
              }
            ],
            before: auditData.biasMetrics,
            after: {
              statisticalParity: -0.032,
              disparateImpact: 0.891,
              equalOpportunity: 0.045,
              equalisedOdds: -0.028,
              calibration: 0.021,
              conditionalParity: -0.018,
              accuracy: 0.8435,
              demographicParity: -0.039,
              predictiveRateCorrection: 0.015,
            },
            improvements: {
              statisticalParity: 0.156,
              disparateImpact: 0.610,
              equalOpportunity: 0.088,
              equalisedOdds: 0.114,
              calibration: 0.064,
              conditionalParity: 0.078,
              demographicParity: 0.166,
              predictiveRateCorrection: 0.063,
            }
          };
          
          setResults(mitigationResults);
          setAuditData({
            ...auditData,
            mitigationResults: mitigationResults,
          });
          
          return 100;
        }
        
        // Update current technique during progress
        const newTechniqueIndex = Math.floor((prev / 100) * techniques.length);
        if (newTechniqueIndex < techniques.length && newTechniqueIndex !== techniqueIndex) {
          techniqueIndex = newTechniqueIndex;
          setCurrentTechnique(techniques[techniqueIndex]);
        }
        
        return prev + Math.random() * 8;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (isMitigating) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-800/90 to-purple-900/90 min-h-full">
        <div className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white tracking-wide">Applying Bias Mitigation</CardTitle>
            <CardDescription className="text-lg text-purple-200 font-semibold">
              Using multiple advanced techniques: {currentTechnique}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="w-24 h-24 mx-auto mb-6">
              <svg className="animate-spin w-full h-full text-green-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-purple-200">
                <span>Mitigation Progress</span>
                <span>{Math.round(mitigationProgress)}%</span>
              </div>
              <Progress value={mitigationProgress} className="h-4 bg-purple-900/50" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-purple-200 font-semibold">
              <div>✓ Applying reweighing algorithm</div>
              <div>✓ Training adversarial debiasing</div>
              <div>✓ Implementing fairness constraints</div>
              <div>✓ Optimizing model parameters</div>
              <div>✓ Calculating new metrics</div>
              <div>✓ Validating improvements</div>
            </div>
          </CardContent>
        </div>
      </div>
    );
  }

  const primaryComparison = [
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
    {
      metric: "Equalised Odds",
      before: Math.abs(results.before.equalisedOdds),
      after: Math.abs(results.after.equalisedOdds),
      improvement: results.improvements.equalisedOdds > 0,
    },
  ];

  const secondaryComparison = [
    {
      metric: "Calibration",
      before: Math.abs(results.before.calibration),
      after: Math.abs(results.after.calibration),
      improvement: results.improvements.calibration > 0,
    },
    {
      metric: "Demographic Parity",
      before: Math.abs(results.before.demographicParity),
      after: Math.abs(results.after.demographicParity),
      improvement: results.improvements.demographicParity > 0,
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-slate-800/90 to-purple-900/90 min-h-full">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-black text-white tracking-wide">Bias Mitigation Results</CardTitle>
        <CardDescription className="text-lg text-purple-200 font-semibold">
          Advanced fairness improvements using multiple techniques
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-2 border-green-400 rounded-xl p-6 text-center backdrop-blur-lg">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-green-200 tracking-wide">BIAS SUCCESSFULLY REDUCED!</h3>
          <p className="text-green-300 font-bold mt-2">Multiple mitigation techniques improved fairness across all metrics.</p>
        </div>

        {/* Applied Techniques */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white tracking-wide">APPLIED MITIGATION TECHNIQUES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.techniques.map((technique, index) => (
              <Card key={index} className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 border-blue-400">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {technique.type === "Pre-processing" ? <Settings className="w-5 h-5 text-blue-400" /> : <Zap className="w-5 h-5 text-purple-400" />}
                    <Badge className="bg-purple-500/20 text-purple-200 font-bold">{technique.type}</Badge>
                  </div>
                  <h4 className="font-black text-white tracking-wide mb-2">{technique.name}</h4>
                  <p className="text-sm text-purple-200">{technique.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Primary Metrics Comparison */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white tracking-wide">PRIMARY METRICS IMPROVEMENT</h3>
          
          {primaryComparison.map((item) => (
            <div key={item.metric} className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-white tracking-wide">{item.metric}</span>
                {item.improvement ? (
                  <Badge className="bg-green-500/20 text-green-300 font-black tracking-wide">SIGNIFICANTLY IMPROVED</Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-300 font-black">STABLE</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-red-400">{item.before.toFixed(3)}</div>
                  <div className="text-sm text-red-300 font-bold">Before</div>
                </div>
                
                <div className="text-center">
                  <ArrowRight className="w-8 h-8 text-purple-400 mx-auto" />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-black text-green-400">{item.after.toFixed(3)}</div>
                  <div className="text-sm text-green-300 font-bold">After</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Visualization */}
        <div className="h-80 bg-gradient-to-br from-slate-800/60 to-purple-900/60 rounded-lg p-4 border border-purple-500/30">
          <h3 className="text-lg font-black text-white mb-4 tracking-wide">COMPREHENSIVE METRICS COMPARISON</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={primaryComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8B5CF6" />
              <XAxis dataKey="metric" stroke="#E5E7EB" fontSize={12} fontWeight="bold" />
              <YAxis stroke="#E5E7EB" fontSize={12} fontWeight="bold" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: '1px solid #8B5CF6',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="before" fill="#EF4444" name="Before Mitigation" radius={[4, 4, 0, 0]} />
              <Bar dataKey="after" fill="#10B981" name="After Mitigation" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Model Performance Summary */}
        <Card className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 border-purple-400">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-purple-200">{results.after.accuracy}</div>
                <div className="text-sm text-purple-300 font-bold">Maintained Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-black text-green-400">✓</div>
                <div className="text-sm text-green-300 font-bold">No Performance Loss</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-400">{primaryComparison.filter(m => m.improvement).length}/{primaryComparison.length}</div>
                <div className="text-sm text-blue-300 font-bold">Metrics Improved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack} className="bg-slate-800 border-purple-500 text-purple-200 hover:bg-slate-700 font-bold">
            Back to Analysis
          </Button>
          <Button onClick={onNext} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black tracking-wide shadow-lg">
            Generate Report
          </Button>
        </div>
      </CardContent>
    </div>
  );
};
