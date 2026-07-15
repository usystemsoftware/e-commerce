import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem('compareItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    setCompareItems((prev) => {
      if (prev.find((p) => p._id === product._id)) {
        toast.info('Product is already in compare list');
        return prev;
      }
      if (prev.length >= 4) {
        toast.warning('You can only compare up to 4 products at a time');
        return prev;
      }
      toast.success('Added to compare list');
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter((p) => p._id !== productId));
    toast.success('Removed from compare list');
  };

  const clearCompare = () => {
    setCompareItems([]);
    toast.success('Compare list cleared');
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
