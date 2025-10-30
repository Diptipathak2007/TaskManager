import { QueryClient } from "@tanstack/react-query";
import  React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
export const queryClient=new QueryClient();

const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}
  <Toaster position="top-center"richColors/>
  </QueryClientProvider>;
};

export default ReactQueryProvider;