import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";
export const queryClient = new QueryClient();

const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {children}
      <Toaster position="top-center" richColors />
    </AuthProvider>
    </QueryClientProvider>
    
  );
};

export default ReactQueryProvider;
