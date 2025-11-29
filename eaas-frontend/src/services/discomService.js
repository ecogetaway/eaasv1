import api from './api.js';
import { mockDiscomStatus } from '../data/mockData.js';

// For demo: Use mock data as primary source
const USE_MOCK_DATA = true; // Set to false to use real backend

// Mock application data
let mockApplications = [
  {
    application_id: 'app_001',
    user_id: 'user_123',
    discom_name: 'BESCOM',
    consumer_number: 'CON123456789',
    status: 'approved',
    submitted_at: '2024-10-15T10:00:00Z',
    approved_at: '2024-10-20T14:30:00Z',
    agreement_number: 'AGR123456',
    sanctioned_load: 5.0
  }
];

export const discomService = {
  /**
   * Get all applications for a user
   */
  getUserApplications: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        applications: mockApplications.filter(app => app.user_id === userId)
      };
    }
    
    try {
      const response = await api.get(`/discom/applications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock applications data');
      return {
        applications: mockApplications.filter(app => app.user_id === userId)
      };
    }
  },

  /**
   * Get a specific application by ID
   */
  getApplicationById: async (applicationId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        application: mockApplications.find(app => app.application_id === applicationId) || mockApplications[0]
      };
    }
    
    try {
      const response = await api.get(`/discom/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock application data');
      return {
        application: mockApplications.find(app => app.application_id === applicationId) || mockApplications[0]
      };
    }
  },

  /**
   * Submit a new net-metering application
   */
  submitApplication: async (applicationData) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newApplication = {
        application_id: `app_${Date.now()}`,
        user_id: applicationData.user_id || 'user_123',
        discom_name: applicationData.discom_name || 'BESCOM',
        consumer_number: applicationData.consumer_number,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        approved_at: null,
        agreement_number: null,
        sanctioned_load: applicationData.sanctioned_load || 5.0,
        ...applicationData
      };
      mockApplications.unshift(newApplication);
      return { application: newApplication };
    }
    
    try {
      const response = await api.post('/discom/applications', applicationData);
      return response.data;
    } catch (error) {
      console.warn('Using mock application submission');
      const newApplication = {
        application_id: `app_${Date.now()}`,
        ...applicationData,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      };
      return { application: newApplication };
    }
  },

  /**
   * Get application status with timeline for a user
   */
  getApplicationStatus: async (userId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const application = mockApplications.find(app => app.user_id === userId) || mockApplications[0];
      return {
        status: mockDiscomStatus,
        application,
        timeline: [
          { status: 'submitted', date: application.submitted_at, description: 'Application submitted' },
          { status: 'under_review', date: new Date(Date.parse(application.submitted_at) + 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'Under review by DISCOM' },
          { status: 'site_inspection', date: new Date(Date.parse(application.submitted_at) + 4 * 24 * 60 * 60 * 1000).toISOString(), description: 'Site inspection completed' },
          { status: 'approved', date: application.approved_at || new Date().toISOString(), description: 'Application approved' }
        ]
      };
    }
    
    try {
      const response = await api.get(`/discom/status/${userId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock application status');
      const application = mockApplications[0];
      return {
        status: mockDiscomStatus,
        application,
        timeline: []
      };
    }
  },

  /**
   * Process application to next status (for demo)
   */
  processApplication: async (applicationId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const application = mockApplications.find(app => app.application_id === applicationId);
      if (application) {
        if (application.status === 'submitted') {
          application.status = 'under_review';
        } else if (application.status === 'under_review') {
          application.status = 'site_inspection';
        } else if (application.status === 'site_inspection') {
          application.status = 'approved';
          application.approved_at = new Date().toISOString();
          application.agreement_number = `AGR${Date.now()}`;
        }
      }
      return { application: application || mockApplications[0] };
    }
    
    try {
      const response = await api.post(`/discom/applications/${applicationId}/process`);
      return response.data;
    } catch (error) {
      console.warn('Using mock application processing');
      return { application: mockApplications[0] };
    }
  },

  /**
   * Get grid sync status for a meter
   */
  getGridSyncStatus: async (meterId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        meter_id: meterId,
        sync_status: 'synced',
        last_sync: new Date().toISOString(),
        export_enabled: true,
        grid_connection: 'active'
      };
    }
    
    try {
      const response = await api.get(`/discom/grid-sync/${meterId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock grid sync status');
      return {
        meter_id: meterId,
        sync_status: 'synced',
        last_sync: new Date().toISOString(),
        export_enabled: true
      };
    }
  },

  /**
   * Update grid sync status
   */
  updateGridSync: async (meterId, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        meter_id: meterId,
        sync_status: data.sync_status || 'synced',
        last_sync: new Date().toISOString(),
        export_enabled: data.export_enabled !== false
      };
    }
    
    try {
      const response = await api.post(`/discom/grid-sync/${meterId}/sync`, data);
      return response.data;
    } catch (error) {
      console.warn('Using mock grid sync update');
      return {
        meter_id: meterId,
        sync_status: 'synced',
        last_sync: new Date().toISOString()
      };
    }
  }
};

export default discomService;

