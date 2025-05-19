import { createContext, useContext } from 'react';

export const CvContext = createContext(null);

export const useCv = () => {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error('useCv must be used within a CvProvider');
  }
  return context;
};
