import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: 'ShopZone',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    currency: 'INR',
    currencySymbol: '₹',
    socialLinks: { facebook: '', twitter: '', instagram: '' },
    address: ''
  });

  useEffect(() => {
    // Fetch settings on initial load
    axios.get('/api/settings')
      .then(res => {
        if (res.data) {
          setSettings(res.data);
        }
      })
      .catch(err => console.error('Failed to load settings', err));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
