import { useContext } from "react";
import { WebsiteSelectContext } from "../context/WebsiteSelectContext";

export function useWebsiteSelect() {
  const context = useContext(WebsiteSelectContext);
  if (!context) {
    throw new Error("useWebsiteSelect must be used within WebsiteSelectProvider");
  }
  return context;
}