import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ConfigProvider } from "antd";
import AdminRouter from "./router/adminRouter";
import CustomerRouter from "./router/customerRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#F4801A",
            borderRadius: 2,
          },
        }}
      >
        <AdminRouter />
        <AuthProvider>
          <CustomerRouter />
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
