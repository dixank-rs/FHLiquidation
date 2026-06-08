import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '@/lib/api/endpoints/health';

export const HealthStatus = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
  });

  if (isLoading) {
    return <div className="text-gray-600">Checking API status...</div>;
  }

  if (error) {
    return <div className="text-red-600">API is unreachable</div>;
  }

  return (
    <div className="space-y-2">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
        API is online
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <div>App: {data?.app_name}</div>
        <div>Environment: {data?.environment}</div>
        <div>Status: {data?.status}</div>
      </div>
    </div>
  );
};
