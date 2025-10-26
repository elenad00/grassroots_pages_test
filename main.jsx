import { createRoot } from "react-dom/client";
import { GetSessionId, SetSessionId } from "./functionality/session-storage";
import { HeaderBar, FooterBar } from "./components/header-footer-bar";
import { WebpageRoutes } from "./functionality/routes";
import "./css/core.module.css";

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
