import axiosInstance from './axios';

// Mock Alerts logic until backend alerts API is ready
let alerts = [
  { id: 'ALT-01', caseId: 'CASE-01', title: 'SMS Reply on CASE-01: Under Review', message: 'The case has been validated by the SME and Lex AI prompt is ready.', read: false },
  { id: 'ALT-02', caseId: 'CASE-01', title: 'Final SMS Feedback: Completed', message: 'All requested modifications are complete. Proceed to next step.', read: true },
];

export const api = {
  // Original axios instance
  axios: axiosInstance,

  // Cases APIs - Now using real backend!
  getCases: async (clientId?: string, targetSme?: string) => {
    try {
      const params = new URLSearchParams();
      if (clientId) params.append('clientId', clientId);
      if (targetSme) params.append('targetSme', targetSme);
      
      const url = `/api/cases${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data; // Mongoose cases array
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  },

  updateCaseStatus: async (caseId: string, payload: any) => {
    try {
      const response = await axiosInstance.patch(`/api/cases/${caseId}/status`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating case status:', error);
      throw error;
    }
  },

  addCaseMessage: async (caseId: string, payload: { sender: string, text?: string, attachments?: any[] }) => {
    try {
      const response = await axiosInstance.post(`/api/cases/${caseId}/messages`, payload);
      return response.data;
    } catch (error) {
      console.error('Error adding case message:', error);
      throw error;
    }
  },

  createCase: async (payload: any) => {
    try {
      const response = await axiosInstance.post('/api/cases', payload);
      const newCase = response.data.case;

      // Mock triggering an alert for the newly created case
      setTimeout(() => {
        alerts.push({
            id: `ALT-${Date.now()}`,
            caseId: newCase.id,
            title: `SMS Received: ${newCase.id}`,
            message: 'SMS Specialist has received your case and is reviewing the documents.',
            read: false
        });
      }, 4000);

      return response.data;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  },

  getSmsUsers: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/sms-users');
      return response.data;
    } catch (error) {
      console.error('Error fetching SMS users:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  // Alerts APIs - Kept mock for now
  getAlerts: async () => {
    return [...alerts].reverse(); // newest first
  },

  markAlertRead: async (alertId: string) => {
    alerts = alerts.map(a => a.id === alertId ? { ...a, read: true } : a);
    return { success: true };
  }
};
