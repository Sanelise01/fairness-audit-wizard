
import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  icon: any;
  status: "completed" | "current" | "pending";
}

interface WizardStepsProps {
  steps: Step[];
  currentStep: number;
}

export const WizardSteps = ({ steps, currentStep }: WizardStepsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 mb-4">Audit Process</h3>
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center space-x-3">
            {/* Status Icon */}
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              step.status === "completed" && "bg-green-100 text-green-600",
              step.status === "current" && "bg-blue-100 text-blue-600",
              step.status === "pending" && "bg-gray-100 text-gray-400"
            )}>
              {step.status === "completed" ? (
                <CheckCircle className="w-5 h-5" />
              ) : step.status === "current" ? (
                <Icon className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>

            {/* Step Info */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium",
                step.status === "completed" && "text-green-700",
                step.status === "current" && "text-blue-700",
                step.status === "pending" && "text-gray-500"
              )}>
                {step.title}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-4 mt-8 w-px h-6 bg-gray-200 ml-0.5" />
            )}
          </div>
        );
      })}
    </div>
  );
};
