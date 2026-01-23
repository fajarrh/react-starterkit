const defaultToken = {
  borderRadius: {
    none: 0,
    small: 2,
    medium: 4,
    large: 8,
    xLarge: 12,
    circular: 9999,
  },
  shadow: {
    2: '0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)',
    4: '0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)',
    8: '0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)',
    16: '0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)',
    28: '0 0 8px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.14)',
    64: '0 0 8px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.14)',
  },
  duration: {
    ultraFast: '50ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    gentle: '250ms',
    slow: '300ms',
    slower: '400ms',
    ultraslow: '500ms',
  },
  curve: {
    easy: 'cubic-bezier(0.33, 0.00, 0.67, 1.00)',
    accelerate: 'cubic-bezier(0.90, 0.10, 1.00, 0.20)',
    decelerate: 'cubic-bezier(0.10, 0.90, 0.20, 1.00)',
  },
};

export default defaultToken;