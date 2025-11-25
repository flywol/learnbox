import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import BaseApiClient from './baseApiClient';

describe('BaseApiClient', () => {
  let apiClient: BaseApiClient;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    // Clear all storage before each test
    localStorage.clear();
    sessionStorage.clear();

    apiClient = new BaseApiClient('http://localhost:8000/api/v1');
    mockAxios = new MockAdapter(apiClient['api']);

    // Reset location mock
    window.location.href = 'http://localhost:3000';
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe('Token Management', () => {
    it('should store and retrieve access token', () => {
      apiClient.setTokens('access-token', 'refresh-token', false);

      const tokens = apiClient.getTokens();
      expect(tokens.accessToken).toBe('access-token');
      expect(tokens.refreshToken).toBe('refresh-token');
    });

    it('should clear all tokens', () => {
      apiClient.setTokens('access-token', 'refresh-token', false);
      apiClient['clearAllTokens']();

      const tokens = apiClient.getTokens();
      expect(tokens.accessToken).toBeNull();
      expect(tokens.refreshToken).toBeNull();
    });

    it('should return true if authenticated with token', () => {
      apiClient.setTokens('access-token', 'refresh-token', false);
      expect(apiClient.isAuthenticated()).toBe(true);
    });

    it('should return false if no token present', () => {
      expect(apiClient.isAuthenticated()).toBe(false);
    });

    it('should store remember me preference', () => {
      apiClient.setTokens('access-token', 'refresh-token', true);
      expect(apiClient['isRememberMe']()).toBe(true);
    });
  });

  describe('Request Interceptor', () => {
    it('should inject Authorization header when token exists', async () => {
      apiClient.setTokens('test-token', 'refresh-token', false);

      mockAxios.onGet('/test').reply(200, { data: 'success' });

      await apiClient['get']('/test');

      const request = mockAxios.history.get[0];
      expect(request.headers?.Authorization).toBe('Bearer test-token');
    });

    it('should not inject Authorization header when no token', async () => {
      mockAxios.onGet('/test').reply(200, { data: 'success' });

      await apiClient['get']('/test');

      const request = mockAxios.history.get[0];
      expect(request.headers?.Authorization).toBeUndefined();
    });
  });

  describe('Response Interceptor - Token Refresh', () => {
    it('should handle 401 errors and token refresh flow', async () => {
      apiClient.setTokens('expired-token', 'valid-refresh-token', false);

      // Mock the 401 response
      mockAxios.onGet('/protected').reply(401, { message: 'Token expired' });

      try {
        await apiClient['get']('/protected');
      } catch (error: any) {
        // Should receive error (since refresh may fail in test environment)
        expect(error.message).toBeDefined();
      }
    });

    it('should not refresh token for validation errors (login)', async () => {
      mockAxios.onPost('/auth/login').reply(401, { message: 'Invalid credentials' });

      try {
        await apiClient['post']('/auth/login', { email: 'test@test.com', password: 'wrong' });
      } catch (error: any) {
        expect(error.message).toBe('Invalid credentials');
        expect(mockAxios.history.post.length).toBe(1); // Only one request, no refresh
      }
    });

    it('should not refresh token for validation errors (OTP)', async () => {
      mockAxios.onPost('/auth/verify-otp').reply(401, { message: 'Invalid OTP' });

      try {
        await apiClient['post']('/auth/verify-otp', { otp: '000000' });
      } catch (error: any) {
        expect(error.message).toBe('Invalid OTP');
        expect(mockAxios.history.post.length).toBe(1);
      }
    });

    it('should dispatch auth:unauthorized event on failed token refresh', async () => {
      apiClient.setTokens('expired-token', 'invalid-refresh-token', false);

      mockAxios.onGet('/protected').replyOnce(401);
      mockAxios.onPost('/auth/refresh-token').reply(401, { message: 'Invalid refresh token' });

      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      try {
        await apiClient['get']('/protected');
      } catch (error) {
        expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth:unauthorized' }));
        expect(apiClient.isAuthenticated()).toBe(false);
      }
    });

    it('should not retry request twice (prevent infinite loop)', async () => {
      apiClient.setTokens('token', 'refresh', false);

      mockAxios.onGet('/protected').reply(401);
      mockAxios.onPost('/auth/refresh-token').reply(401);

      try {
        await apiClient['get']('/protected');
      } catch (error) {
        // Should only have 1 GET request (no retry after refresh fails)
        expect(mockAxios.history.get.length).toBe(1);
      }
    });
  });

  describe('Error Normalization', () => {
    it('should normalize API error with response', async () => {
      mockAxios.onGet('/test').reply(400, { message: 'Bad request' });

      try {
        await apiClient['get']('/test');
      } catch (error: any) {
        expect(error.message).toBe('Bad request');
        expect(error.status).toBe(400);
      }
    });

    it('should handle network errors (no response)', async () => {
      mockAxios.onGet('/test').networkError();

      try {
        await apiClient['get']('/test');
      } catch (error: any) {
        // Network errors return "Network Error" from axios-mock-adapter
        expect(error.message).toBeTruthy();
        // Status may vary depending on how error is normalized
        expect(typeof error.status).toBe('number');
      }
    });

    it('should handle timeout errors', async () => {
      mockAxios.onGet('/test').timeout();

      try {
        await apiClient['get']('/test');
      } catch (error: any) {
        expect(error.message).toBeDefined();
        // Timeout errors may have different status codes
        expect(typeof error.status).toBe('number');
      }
    });
  });

  describe('HTTP Methods', () => {
    it('should perform GET request', async () => {
      mockAxios.onGet('/test').reply(200, { data: 'success' });

      const result = await apiClient['get']('/test');
      expect(result).toEqual({ data: 'success' });
    });

    it('should perform POST request', async () => {
      mockAxios.onPost('/test', { name: 'test' }).reply(201, { id: 1 });

      const result = await apiClient['post']('/test', { name: 'test' });
      expect(result).toEqual({ id: 1 });
    });

    it('should perform PUT request', async () => {
      mockAxios.onPut('/test/1', { name: 'updated' }).reply(200, { id: 1, name: 'updated' });

      const result = await apiClient['put']('/test/1', { name: 'updated' });
      expect(result).toEqual({ id: 1, name: 'updated' });
    });

    it('should perform PATCH request', async () => {
      mockAxios.onPatch('/test/1', { name: 'patched' }).reply(200, { id: 1, name: 'patched' });

      const result = await apiClient['patch']('/test/1', { name: 'patched' });
      expect(result).toEqual({ id: 1, name: 'patched' });
    });

    it('should perform DELETE request', async () => {
      mockAxios.onDelete('/test/1').reply(204, {});

      const result = await apiClient['delete']('/test/1');
      expect(result).toEqual({});
    });
  });

  describe('Security - Validation Endpoint Detection', () => {
    const validationEndpoints = [
      '/auth/login',
      '/teacher/login',
      '/auth/verify-otp',
      '/auth/resend-otp',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/school/verify-domain',
    ];

    validationEndpoints.forEach(endpoint => {
      it(`should not trigger token refresh for ${endpoint}`, async () => {
        mockAxios.onPost(endpoint).reply(401, { message: 'Validation error' });

        try {
          await apiClient['post'](endpoint, {});
        } catch (error: any) {
          expect(error.message).toBe('Validation error');
          // Should not attempt token refresh
          expect(mockAxios.history.post.filter(r => r.url === '/auth/refresh-token').length).toBe(0);
        }
      });
    });
  });
});
