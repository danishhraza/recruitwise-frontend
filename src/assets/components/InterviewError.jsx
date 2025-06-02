import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const InterviewError = ({ onDashboardClick }) => {
  return (
    <div className="h-screen flex justify-center items-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center border">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Access Denied
        </h1>
        
        <Alert variant="destructive" className="mb-6 text-left text-white">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Interview Access Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p className="font-medium">
              Invalid account or Interview has already begun
            </p>
            <p className="text-sm">
              Please relog or contact support
            </p>
          </AlertDescription>
        </Alert>
        
        <button
          onClick={onDashboardClick}
          className="w-full bg-primary hover:bg-primary/90 font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </button>
        
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            If you continue to experience issues, please contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewError;