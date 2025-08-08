export const SERVICES_CONFIG = {
  auth: {
    baseUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
    endpoints: {
      validateToken: '/auth/validate',
    },
  },
  workspace: {
    baseUrl: process.env.WORKSPACE_SERVICE_URL || 'http://localhost:3002',
    endpoints: {
      findById: '/workspaces',
    },
  },
  booking: {
    baseUrl: process.env.BOOKING_SERVICE_URL || 'http://localhost:3003',
    endpoints: {
      findByUserId: '/bookings',
    },
  },
  notification: {
    baseUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
    endpoints: {
      create: '/notifications',
    },
  },
  reporting: {
    baseUrl: process.env.REPORTING_SERVICE_URL || 'http://localhost:3006',
    endpoints: {
      create: '/reports',
    },
  },
} as const; 