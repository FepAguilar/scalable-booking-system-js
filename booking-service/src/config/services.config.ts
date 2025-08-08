export const SERVICES_CONFIG = {
  user: {
    baseUrl: process.env.USER_SERVICE_URL || "http://localhost:3001",
    endpoints: {
      findById: "/user",
    },
  },
  workspace: {
    baseUrl: process.env.WORKSPACE_SERVICE_URL || "http://localhost:3002",
    endpoints: {
      findById: "/workspaces",
    },
  },
  payment: {
    baseUrl: process.env.PAYMENT_SERVICE_URL || "http://localhost:3004",
    endpoints: {
      create: "/payments",
    },
  },
  notification: {
    baseUrl: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3005",
    endpoints: {
      create: "/notifications",
    },
  },
  reporting: {
    baseUrl: process.env.REPORTING_SERVICE_URL || "http://localhost:3006",
    endpoints: {
      create: "/reports",
    },
  },
} as const;
