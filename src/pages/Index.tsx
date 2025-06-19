
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, FileSpreadsheet, BarChart3, Shield, Download } from "lucide-react";
import { WizardSteps } from "@/components/WizardSteps";
import { DatasetUpload } from "@/components/DatasetUpload";
import { BiasAnalysis } from "@/components/BiasAnalysis";
import { MitigationResults } from "@/components/MitigationResults";
import { AuditReport } from "@/components/AuditReport";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [auditData, setAuditData] = useState({
    dataset: null,
    protectedAttribute: "",
    biasMetrics: null,
    mitigationResults: null,
  });

  const steps = [
    { 
      id: 1, 
      title: "Dataset Upload", 
      icon: FileSpreadsheet, 
      status: (currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending") as "completed" | "current" | "pending"
    },
    { 
      id: 2, 
      title: "Bias Analysis", 
      icon: BarChart3, 
      status: (currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending") as "completed" | "current" | "pending"
    },
    { 
      id: 3, 
      title: "Mitigation", 
      icon: Shield, 
      status: (currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending") as "completed" | "current" | "pending"
    },
    { 
      id: 4, 
      title: "Report", 
      icon: Download, 
      status: (currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "pending") as "completed" | "current" | "pending"
    },
  ];

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DatasetUpload onNext={() => setCurrentStep(2)} auditData={auditData} setAuditData={setAuditData} />;
      case 2:
        return <BiasAnalysis onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} auditData={auditData} setAuditData={setAuditData} />;
      case 3:
        return <MitigationResults onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} auditData={auditData} setAuditData={setAuditData} />;
      case 4:
        return <AuditReport onBack={() => setCurrentStep(3)} auditData={auditData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 border-b-4 border-purple-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI FAIRNESS AUDIT
                </span>
              </h1>
              <p className="text-purple-200 mt-2 text-lg font-semibold">
                Next-Generation AI Bias Detection & Mitigation Platform
              </p>
            </div>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-400 text-lg px-4 py-2 font-bold">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-lg font-bold text-purple-200 mb-4">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-4 bg-purple-900/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Steps */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-purple-900/80 to-slate-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 shadow-2xl p-6">
              <WizardSteps steps={steps} currentStep={currentStep} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-2xl border-2 border-purple-500/30 bg-gradient-to-br from-slate-800/90 to-purple-900/90 backdrop-blur-lg rounded-2xl">
              <CardContent className="p-0">
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
