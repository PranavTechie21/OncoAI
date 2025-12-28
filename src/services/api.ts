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
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
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

  async register(name: string, email: string, password: string) {
    const response = await this.request<ApiResponse<{ user: any }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
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

  // Appointments endpoints
  async getAppointments() {
    return this.request<ApiResponse<{ appointments: any[] }>>('/appointments');
  }

  // Dashboard summary
  async getDashboardSummary() {
    return this.request<ApiResponse<any>>('/dashboard/summary');
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

  // Health check
  async healthCheck() {
    return this.request<ApiResponse<any>>('/health');
  }
}

export const apiService = new ApiService();

