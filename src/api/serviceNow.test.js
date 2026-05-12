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
import { authenticateUser, fetchCustomerMetrics } from './serviceNow';

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
});
