# Roles & Permissions

PrairieHQ utilizes role-based access control (RBAC) to ensure employees have access to the exact tools they need while securing sensitive financial and customer data.

## Standard System Roles

| Role | Primary Responsibilities | Access Level |
| :--- | :--- | :--- |
| **Administrator** | Business owners and executive leadership. | Full access across all organizations, billing settings, user management, and financials. |
| **Manager / Dispatcher** | Operations managers, route dispatchers, and branch leads. | Full scheduling, work order dispatch, employee management, and operational reporting. |
| **Estimator / Sales** | Account executives and business development reps. | Customer records, estimate and proposal creation, e-signature tracking, and pricing tables. |
| **Crew Leader / Foreman** | Field crew leaders managing a job site. | View assigned jobs, route navigation, crew clock-in/out, job checklists, and site review logs. |
| **Crew Member / Field Tech** | Field technicians and seasonal crew members. | Personal mobile clock-in/out and viewing their own daily route or assigned tasks. |

---

## Permission Scopes

PrairieHQ evaluates granular permissions using a `<domain>:<action>` format:

- **Customer Operations**: `customer:list`, `customer:read`, `customer:create`, `customer:update`
- **Work Orders**: `work-order:list`, `work-order:create`, `work-order:update`, `work-order:delete`
- **Documents & Pricing**: `document:list`, `document:create`, `document:sign`, `document:pricing`
- **Scheduling**: `job:list`, `job:schedule`, `job:assign`
- **Financial Access**: `invoice:list`, `invoice:create`, `daily-financial:list`, `pnl:list`, `cash-flow:list`
- **Resourcing**: `employee:list`, `clock-in-out:create`, `time-off:approve`, `payroll:list`

---

## Managing User Accounts

1. Navigate to **Settings → Users & Permissions**.
2. Click **Invite User** and enter their work email address and legal name.
3. Select their primary role and designate their operating organization branch.
4. The user will receive an email invitation to set up their password.
