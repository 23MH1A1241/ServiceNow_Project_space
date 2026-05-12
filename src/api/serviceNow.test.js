import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios BEFORE importing the module under test
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
    ...mockAxiosInstance, // For any direct calls
  };
});

// Import AFTER mocking
import { 
  authenticateUser, 
  fetchCustomerMetrics, 
  submitCsat, 
  getCaseSlaPercentage,
  fetchAgentMetrics
} from './serviceNow';

describe('serviceNow API', () => {
  const mockClient = axios.create();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('authenticateUser should return user data on success', async () => {
    const mockUser = {
      sys_id: '123',
      user_name: 'testuser',
      name: 'Test User',
      email: 'test@example.com'
    };
    
    mockClient.get.mockResolvedValue({ data: { result: [mockUser] } });

    const user = await authenticateUser('testuser', 'password');
    expect(user.user_name).toBe('testuser');
    expect(user.role).toBe('customer');
  });

  it('fetchCustomerMetrics should calculate open and resolved cases', async () => {
    const mockCases = [
      { state: '1', escalation: '0' },
      { state: '2', escalation: '1' },
      { state: '3', escalation: '0' }
    ];

    mockClient.get.mockResolvedValue({ data: { result: mockCases } });

    const metrics = await fetchCustomerMetrics('123');
    expect(metrics.open).toBe(2);
    expect(metrics.resolved).toBe(1);
    expect(metrics.escalated).toBe(1);
  });

  it('submitCsat should post feedback successfully', async () => {
    mockClient.post.mockResolvedValue({ data: { result: { status: 'success' } } });
    const result = await submitCsat('case123', 5);
    expect(result.status).toBe('success');
    expect(mockClient.post).toHaveBeenCalledWith(expect.stringContaining('case123'), expect.objectContaining({ u_csat_score: 5 }));
  });

  it('getCaseSlaPercentage should return percentage value', async () => {
    mockClient.get.mockResolvedValue({ data: { result: [{ percentage: '75' }] } });
    const percentage = await getCaseSlaPercentage('case123');
    expect(percentage).toBe(75);
  });

  it('fetchAgentMetrics should aggregate agent-specific KPIs', async () => {
    const mockCases = [
      { priority: '1', escalation: '1', state: '2' },
      { priority: '3', escalation: '0', state: '7' }
    ];
    mockClient.get.mockResolvedValue({ data: { result: mockCases } });
    const metrics = await fetchAgentMetrics('agent1', 'id1');
    expect(metrics.assigned).toBe(2);
    expect(metrics.critical).toBe(1);
    expect(metrics.resolved).toBe(1);
  });
});
