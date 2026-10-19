import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'PrairieHQ Docs',
  description: 'User & Product Guides for PrairieHQ Field Service Management',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],
  themeConfig: {
    logo: {
      light: '/logo-icon.svg',
      dark: '/logo-icon-dark.svg',
    },
    siteTitle: 'PrairieHQ Docs',

    nav: [
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Work Orders', link: '/workbook/work-orders' },
      { text: 'Scheduling', link: '/operations/scheduling' },
      { text: 'Financials', link: '/financials/invoices' },
      { text: 'Resourcing', link: '/resourcing/employees' },
      { text: 'Client Portal', link: '/portal/overview' },
      { text: 'Developer (OAuth2)', link: '/developer/oauth2' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Platform Overview', link: '/guide/getting-started' },
          { text: 'Navigation & Workspace', link: '/guide/navigation' },
          { text: 'Roles & Permissions', link: '/guide/roles-and-permissions' },
        ],
      },
      {
        text: 'Customers & Workbook',
        collapsed: false,
        items: [
          { text: 'Customer Management', link: '/workbook/customers' },
          { text: 'Documents & Estimates', link: '/workbook/documents' },
          { text: 'Work Orders', link: '/workbook/work-orders' },
          { text: 'Site Reviews', link: '/workbook/site-reviews' },
        ],
      },
      {
        text: 'Operations & Dispatch',
        collapsed: false,
        items: [
          { text: 'Work Schedule & Calendar', link: '/operations/scheduling' },
          { text: 'Crew Tracking & Field View', link: '/operations/crew-tracking' },
          { text: 'On-Demand Jobs', link: '/operations/on-demand' },
          { text: 'Snow & Winter Operations', link: '/operations/snow-removal' },
        ],
      },
      {
        text: 'Resourcing & Team',
        collapsed: false,
        items: [
          { text: 'Employee Management', link: '/resourcing/employees' },
          { text: 'Clock In / Clock Out', link: '/resourcing/clock-in-out' },
          { text: 'Time Off Requests', link: '/resourcing/time-off' },
          { text: 'Payroll Management', link: '/resourcing/payroll' },
        ],
      },
      {
        text: 'Financials & Billing',
        collapsed: false,
        items: [
          { text: 'Invoicing & Payments', link: '/financials/invoices' },
          { text: 'Daily Financials', link: '/financials/daily-financials' },
          { text: 'Profit & Loss (P&Ls)', link: '/financials/pnl' },
          { text: 'Cash Flow Management', link: '/financials/cash-flow' },
        ],
      },
      {
        text: 'Client Portal',
        collapsed: false,
        items: [
          { text: 'Client Portal Overview', link: '/portal/overview' },
          { text: 'Approvals & Online Payments', link: '/portal/payments-and-approvals' },
        ],
      },
      {
        text: 'Developer & API',
        collapsed: false,
        items: [
          { text: 'OAuth 2.0 Overview', link: '/developer/oauth2' },
          { text: 'Authorization Code Flow & PKCE', link: '/developer/authorization-code-flow' },
          { text: 'Tokens, Scopes & Claims', link: '/developer/tokens-and-scopes' },
          { text: 'Client Integration Examples', link: '/developer/client-examples' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'PrairieHQ User Documentation & Field Service Operations Guide',
      copyright: `Copyright © ${new Date().getFullYear()} PrairieHQ`,
    },
  },
});
