import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HealthStatus } from './HealthStatus';
import { checkHealth } from '@/lib/api/endpoints/health';

jest.mock('@/lib/api/endpoints/health');

const mockedCheckHealth = checkHealth as jest.MockedFunction<typeof checkHealth>;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('HealthStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state initially', async () => {
    mockedCheckHealth.mockImplementation(() => new Promise(() => {}));
    
    renderWithQueryClient(<HealthStatus />);
    
    expect(screen.getByText('Checking API status...')).toBeInTheDocument();
  });

  test('shows API online on success', async () => {
    const mockHealthResponse = {
      status: 'ok',
      environment: 'development',
      app_name: 'FHIL'
    };
    
    mockedCheckHealth.mockResolvedValue(mockHealthResponse);
    
    renderWithQueryClient(<HealthStatus />);
    
    await waitFor(() => {
      expect(screen.getByText('API is online')).toBeInTheDocument();
    });
  });

  test('shows error when API unreachable', async () => {
    const mockError = new Error('Network error');
    mockedCheckHealth.mockRejectedValue(mockError);
    
    renderWithQueryClient(<HealthStatus />);
    
    await waitFor(() => {
      expect(screen.getByText('API is unreachable')).toBeInTheDocument();
    });
  });
});
