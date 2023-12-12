// AnimationContext.js
import { createContext, useContext, useState } from "react";

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [selectedAnimation, setSelectedAnimation] = useState(null);

  return (
    <AnimationContext.Provider value={{ selectedAnimation, setSelectedAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};
