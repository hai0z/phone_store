import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ConfigProvider } from "antd";
import AdminRouter from "./router/adminRouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1677FF",
            borderRadius: 16,
          },
        }}
      >
        <AdminRouter />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
