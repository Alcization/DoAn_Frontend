/**
 * ----------------------------------------------------------------------------
 * API INTEGRATION UTILITY
 * ----------------------------------------------------------------------------
 * USE_MOCK: Set this to 'false' in your .env file (NEXT_PUBLIC_USE_MOCK=false)
 * to start using real API endpoints instead of mock data.
 */
export const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'; 

/**
 * handleRequest: Wraps API calls to provide a consistent mock/real data toggle.
 * When useMock is true, it returns mockData after a short delay.
 * When useMock is false, it executes the real apiCall.
 */
export const handleRequest = async <T>(apiCall: () => Promise<T>, mockData: T): Promise<T> => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 500); 
    });
  }
  
  // REAL API INTEGRATION POINT:
  // This is where the actual axios call (apiCall) is executed.
  return apiCall();
};
