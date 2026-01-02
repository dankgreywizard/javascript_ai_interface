import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useModels } from '../useModels';

describe('useModels', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useModels('chat'));
    expect(result.current.models).toEqual([]);
    expect(result.current.selectedModel).toBe('codellama:latest');
  });

  it('should fetch models when tab is git', async () => {
    const mockModels = ['model1', 'model2', 'codellama:latest'];
    (vi.mocked(fetch) as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ models: mockModels }),
    });

    const { result } = renderHook(() => useModels('git'));

    await waitFor(() => {
      expect(result.current.models).toEqual(mockModels);
    });
    expect(result.current.selectedModel).toBe('codellama:latest');
  });

  it('should default to the first model if codellama:latest is not available', async () => {
    const mockModels = ['model1', 'model2'];
    (vi.mocked(fetch) as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ models: mockModels }),
    });

    const { result } = renderHook(() => useModels('git'));

    await waitFor(() => {
      expect(result.current.models).toEqual(mockModels);
    });
    expect(result.current.selectedModel).toBe('model1');
  });

  it('should keep selected model if it is in the fetched list', async () => {
    const mockModels = ['model1', 'model2', 'current-model'];
    (vi.mocked(fetch) as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ models: mockModels }),
    });

    // Initial render with 'git' tab will trigger first fetch
    const { result } = renderHook(() => useModels('git'));
    
    // Wait for first fetch to complete (it will default to 'model1' since 'codellama:latest' is missing)
    await waitFor(() => {
      expect(result.current.models).toEqual(mockModels);
    });
    expect(result.current.selectedModel).toBe('model1');

    // Now change the selected model
    act(() => {
      result.current.setSelectedModel('current-model');
    });

    // This triggers another fetch because selectedModel is a dependency
    (vi.mocked(fetch) as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ models: mockModels }),
    });

    // Wait for the second fetch/effect to settle
    await waitFor(() => {
      expect(result.current.selectedModel).toBe('current-model');
    });
  });

  it('should not fetch models if tab is not git', async () => {
    renderHook(() => useModels('chat'));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should handle fetch errors gracefully', async () => {
    (vi.mocked(fetch) as any).mockRejectedValueOnce(new Error('Fetch failed'));

    const { result } = renderHook(() => useModels('git'));

    // Wait a bit to ensure useEffect has run
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(result.current.models).toEqual([]);
    expect(result.current.selectedModel).toBe('codellama:latest');
  });
});
