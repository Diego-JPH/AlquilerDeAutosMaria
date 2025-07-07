import RegisterEmployeeForm from "../components/registarEmployeeForm";
import EmployeeList from "../components/employeeList";
import ActualizarSucursalEmpleado from '../components/ActualizarSucursalEmpleado';

function RegisterEmployeePage() {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center items-start">
        <RegisterEmployeeForm />
        <ActualizarSucursalEmpleado />
      </div>
      <div className="mt-8">
        <EmployeeList />
      </div>
    </div>
  );
}

export default RegisterEmployeePage;
