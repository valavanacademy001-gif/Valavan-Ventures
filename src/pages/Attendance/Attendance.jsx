import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';
import AdminAttendance from './AdminAttendance';
import EmployeeAttendance from './EmployeeAttendance';

export default function Attendance() {
  const { currentUser } = useAuth();
  
  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR].includes(currentUser?.role);

  if (isAdmin) {
    return <AdminAttendance />;
  }
  
  return <EmployeeAttendance />;
}
