import RegisterEmployeeForm from "../components/registarEmployeeForm";
import EmployeeList from "../components/employeeList";

function RegisterEmployeePage() {
  return (
    <div className="p-8">
      <RegisterEmployeeForm />
      <EmployeeList />
    </div>
  );
}

export default RegisterEmployeePage;
