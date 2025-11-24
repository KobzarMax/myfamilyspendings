import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

describe('Auth Store', () => {
  it('initializes with null user and familyId', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.familyId).toBeNull();
  });

  it('sets user correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { 
      id: '123', 
      email: 'test@example.com', 
      fullName: 'Test User',
      avatarUrl: null,
      familyId: null,
      updatedAt: null
    };
    
    act(() => {
      result.current.setUser(mockUser);
    });
    
    expect(result.current.user).toEqual(mockUser);
  });

  it('sets familyId correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setFamilyId('family-456');
    });
    
    expect(result.current.familyId).toBe('family-456');
  });

  it('clears auth state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setUser({ 
        id: '123', 
        email: 'test@example.com',
        fullName: 'Test User',
        avatarUrl: null,
        familyId: null,
        updatedAt: null
      });
      result.current.setFamilyId('family-456');
    });
    
    expect(result.current.user).toBeTruthy();
    expect(result.current.familyId).toBeTruthy();
    
    act(() => {
      result.current.clearAuth();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.familyId).toBeNull();
  });
});
