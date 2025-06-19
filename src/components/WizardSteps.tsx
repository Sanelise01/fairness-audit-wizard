
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
    <div className="space-y-6">
      <h3 className="font-black text-xl text-white mb-6 tracking-wide">
        AUDIT PROCESS
      </h3>
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.id} className="relative">
            <div className="flex items-center space-x-4">
              {/* Status Icon */}
              <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg",
                step.status === "completed" && "bg-gradient-to-r from-green-400 to-emerald-500 border-green-300 shadow-green-500/50",
                step.status === "current" && "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-300 shadow-purple-500/50",
                step.status === "pending" && "bg-slate-700 border-slate-500 shadow-slate-500/30"
              )}>
                {step.status === "completed" ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : step.status === "current" ? (
                  <Icon className="w-6 h-6 text-white" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-400" />
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-bold tracking-wide",
                  step.status === "completed" && "text-green-300",
                  step.status === "current" && "text-purple-200",
                  step.status === "pending" && "text-slate-400"
                )}>
                  {step.title}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "absolute left-6 top-12 w-px h-8 ml-0.5",
                step.status === "completed" ? "bg-gradient-to-b from-green-400 to-purple-500" : "bg-slate-600"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};
