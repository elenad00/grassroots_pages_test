import { createRoot } from "react-dom/client";
import { GetSessionId, SetSessionId } from "./client/src/functionality/session-storage";
import { HeaderBar, FooterBar } from "./client/src/components/header-footer-bar";
import { WebpageRoutes } from "./client/src/functionality/routes";
import "./client/src/css/core.module.css";

if(!GetSessionId()){
  SetSessionId()
}

createRoot(document.getElementById("root")).render(
  <>
    <HeaderBar />
    <WebpageRoutes />
    <FooterBar />
  </>
);
