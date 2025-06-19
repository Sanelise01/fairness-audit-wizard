
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fairness Audit Wizard</h1>
              <p className="text-gray-600 mt-1">Comprehensive AI bias detection and mitigation toolkit</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Steps */}
          <div className="lg:col-span-1">
            <WizardSteps steps={steps} currentStep={currentStep} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
