import { createContext, useState } from "react";

export const WebsiteSelectContext = createContext();

export function WebsiteSelectProvider({ children }) {
  const [showWebsiteSelect, setShowWebsiteSelect] = useState(false);

  return (
    <WebsiteSelectContext.Provider value={{ showWebsiteSelect, setShowWebsiteSelect }}>
      {children}
    </WebsiteSelectContext.Provider>
  );
}