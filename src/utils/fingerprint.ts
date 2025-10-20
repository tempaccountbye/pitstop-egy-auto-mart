// Generate a browser fingerprint based on non-sensitive browser attributes
export const generateFingerprint = (): string => {
  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(',') || '',
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    screenColorDepth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
  };

  // Convert to JSON and encode as base64
  const jsonString = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(jsonString)));
};

// Decode and format a base64 fingerprint
export const decodeFingerprint = (fingerprint: string): Record<string, any> | null => {
  try {
    const jsonString = decodeURIComponent(escape(atob(fingerprint)));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decode fingerprint:', error);
    return null;
  }
};
