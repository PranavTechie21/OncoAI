const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('oncoai_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log(`[API] Sending request to ${endpoint} with token (length: ${token.length})`);
    } else {
      console.log(`[API] Sending request to ${endpoint} without token`);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('oncoai_token');
          localStorage.removeItem('oncoai_user');
          window.dispatchEvent(new Event('auth:logout'));
        }

        const error = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Failed to fetch - Backend server may not be running');
      }
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<ApiResponse<{ token: string; user: any }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    institution?: string;
    department?: string;
    license?: string;
    npi?: string;
    specialty?: string;
    subspecialty?: string;
    location?: string;
  }) {
    const response = await this.request<ApiResponse<{ user: any }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  // Current user
  async getCurrentUser() {
    return this.request<ApiResponse<{ user: any }>>('/auth/me');
  }

  async updateCurrentUser(data: any) {
    return this.request<ApiResponse<{ user: any }>>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Patient endpoints
  async getPatients() {
    return this.request<ApiResponse<{ patients: any[] }>>('/patients');
  }

  async getPatient(id: number) {
    return this.request<ApiResponse<any>>(`/patients/${id}`);
  }

  async createPatient(patientData: any) {
    return this.request<ApiResponse<{ patient: any }>>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id: number, patientData: any) {
    return this.request<ApiResponse<{ patient: any }>>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id: number) {
    return this.request<ApiResponse<{ message: string }>>(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Recommendations endpoints
  async getRecommendations(patientId: number) {
    return this.request<ApiResponse<{ recommendations: any }>>(`/recommendations/patient/${patientId}`);
  }

  async listRecommendations() {
    return this.request<ApiResponse<{ recommendations: any[] }>>('/recommendations');
  }

  // Reports endpoints
  async getReports() {
    return this.request<ApiResponse<{ reports: any[] }>>('/reports');
  }

  async generateReport(patientId: number) {
    return this.request<ApiResponse<{ report: any }>>(`/reports/patient/${patientId}`, {
      method: 'POST',
    });
  }

  async downloadPatientReport(patientId: number) {
    return this.request<any>(`/reports/patient/${patientId}/download`);
  }

  // Appointments endpoints
  async getAppointments() {
    return this.request<ApiResponse<{ appointments: any[] }>>('/appointments');
  }

  // Dashboard summary
  async getDashboardSummary(range?: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (range) params.append('range', range);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = `/dashboard/summary${queryString ? `?${queryString}` : ''}`;

    const response = await this.request<any>(url);
    // Backend returns data directly, not wrapped in ApiResponse format
    return response;
  }

  async createAppointment(appointmentData: any) {
    return this.request<ApiResponse<{ appointment: any }>>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id: number, appointmentData: any) {
    return this.request<ApiResponse<{ appointment: any }>>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id: number) {
    return this.request<ApiResponse<{ message: string }>>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Outcomes endpoints
  async getPatientOutcomes(patientId: number) {
    return this.request<ApiResponse<{ outcomes: any[] }>>(`/outcomes/patient/${patientId}`);
  }

  async createOutcome(patientId: number, outcomeData: any) {
    return this.request<ApiResponse<{ outcome: any }>>(`/outcomes/patient/${patientId}`, {
      method: 'POST',
      body: JSON.stringify(outcomeData),
    });
  }

  async updateOutcome(outcomeId: number, outcomeData: any) {
    return this.request<ApiResponse<{ outcome: any }>>(`/outcomes/${outcomeId}`, {
      method: 'PUT',
      body: JSON.stringify(outcomeData),
    });
  }

  async getOutcomeComparison(patientId: number) {
    return this.request<ApiResponse<{ comparisons: any[] }>>(`/outcomes/comparison/patient/${patientId}`);
  }

  // Health check
  async healthCheck() {
    return this.request<ApiResponse<any>>('/health');
  }
}

export const apiService = new ApiService();

