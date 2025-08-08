export const SERVICES_CONFIG = {
  booking: {
    baseUrl: process.env.BOOKING_SERVICE_URL || 'http://localhost:3003',
    endpoints: {
      findByWorkspaceId: '/bookings',
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