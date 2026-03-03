import apiClient from './apiClient';
import type { LoginResponse } from './types';

export async function login(username: string, password: string): Promise<string> {
  const { data } = await apiClient.post<LoginResponse>('/api/auth/token', { username, password });
  return data.token;
}
