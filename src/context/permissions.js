// Permissions configuration — separated from AuthContext for Vite HMR compatibility
export const PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'view_all_dashboards', 'approve_tasks', 'submit_for_review', 'add_employee',
    'edit_attendance', 'approve_leaves', 'generate_payslip', 'view_payslips',
    'manage_settings', 'view_all_employees', 'assign_tasks', 'view_reports',
    'manage_projects', 'send_announcements',
  ],
  hr: [
    'view_all_dashboards', 'submit_for_review', 'add_employee',
    'edit_attendance', 'approve_leaves', 'generate_payslip', 'view_payslips',
    'view_all_employees', 'view_reports', 'send_announcements',
  ],
  manager: [
    'view_all_dashboards', 'approve_tasks', 'submit_for_review',
    'approve_leaves', 'view_payslips', 'view_all_employees', 'assign_tasks',
    'manage_projects',
  ],
  employee: [
    'submit_for_review', 'view_own_payslips', 'view_own_attendance',
    'apply_leave', 'view_own_profile',
  ],
};
