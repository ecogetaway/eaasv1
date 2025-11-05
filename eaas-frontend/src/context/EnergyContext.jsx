import { createContext, useContext, useState, useEffect } from 'react';
import socketService from '../services/socketService.js';
import { energyService } from '../services/energyService.js';

const EnergyContext = createContext(null);

export const EnergyProvider = ({ children, userId }) => {
  const [currentEnergy, setCurrentEnergy] = useState(null);
  const [energyHistory, setEnergyHistory] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Connect socket
    socketService.connect();
    socketService.subscribeToUser(userId);

    // Listen for real-time updates
    const handleEnergyUpdate = (data) => {
      setCurrentEnergy(data);
    };

    socketService.onEnergyUpdate(handleEnergyUpdate);

    // Load initial data
    loadEnergyData();

    return () => {
      socketService.offEnergyUpdate(handleEnergyUpdate);
      socketService.unsubscribeFromUser(userId);
    };
  }, [userId]);

  const loadEnergyData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const [current, history, summary] = await Promise.all([
        energyService.getCurrentEnergy(userId).catch(() => null),
        energyService.getEnergyHistory(userId, 'day').catch(() => ({ data: [] })),
        energyService.getDashboardSummary(userId).catch(() => null),
      ]);

      // Validate and set current energy data
      if (current && current.data) {
        const validated = {
          ...current.data,
          solar_generation: parseFloat(current.data.solar_generation || 0) || 0,
          grid_import: parseFloat(current.data.grid_import || 0) || 0,
          grid_export: parseFloat(current.data.grid_export || 0) || 0,
          battery_charge: parseFloat(current.data.battery_charge || 0) || 0,
          total_consumption: parseFloat(current.data.total_consumption || 0) || 0,
        };
        setCurrentEnergy(validated);
      }
      
      // Validate and set history data
      if (history && history.data) {
        const validatedHistory = (history.data || []).map(item => ({
          ...item,
          solar_generation: parseFloat(item.solar_generation || 0) || 0,
          grid_import: parseFloat(item.grid_import || 0) || 0,
          grid_export: parseFloat(item.grid_export || 0) || 0,
          battery_charge: parseFloat(item.battery_charge || 0) || 0,
          total_consumption: parseFloat(item.total_consumption || 0) || 0,
        }));
        setEnergyHistory(validatedHistory);
      }
      
      // Validate and set summary data
      if (summary) {
        const validatedSummary = {
          today: {
            solar_units: parseFloat(summary.today?.solar_units || 0) || 0,
            total_consumption: parseFloat(summary.today?.total_consumption || 0) || 0,
            savings: parseFloat(summary.today?.savings || 0) || 0,
            carbon_offset: parseFloat(summary.today?.carbon_offset || 0) || 0,
          },
          month: {
            solar_units: parseFloat(summary.month?.solar_units || 0) || 0,
            total_consumption: parseFloat(summary.month?.total_consumption || 0) || 0,
            savings: parseFloat(summary.month?.savings || 0) || 0,
            carbon_offset: parseFloat(summary.month?.carbon_offset || 0) || 0,
          },
        };
        setDashboardSummary(validatedSummary);
      }
    } catch (error) {
      console.error('Error loading energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (period = 'day') => {
    if (!userId) return;
    try {
      const data = await energyService.getEnergyHistory(userId, period);
      setEnergyHistory(data.data || []);
    } catch (error) {
      console.error('Error loading energy history:', error);
    }
  };

  const value = {
    currentEnergy,
    energyHistory,
    dashboardSummary,
    loading,
    loadHistory,
    refresh: loadEnergyData,
  };

  return <EnergyContext.Provider value={value}>{children}</EnergyContext.Provider>;
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error('useEnergy must be used within EnergyProvider');
  }
  return context;
};

