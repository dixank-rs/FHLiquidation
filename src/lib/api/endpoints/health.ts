import apiClient from '@/lib/api/client';

export interface HealthResponse {
  status: string;
  environment: string;
  app_name: string;
}

export const checkHealth = (): Promise<HealthResponse> => {
  return apiClient.get('/health').then(response => response.data);
};
