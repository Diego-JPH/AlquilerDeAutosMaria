import MarkDeliveryForm from "../../components/MarkDeliveryForm";
import RegisterReturn from "../../components/RegisterReturn";
import VehicleCatalogEmpleado from '../../components/VehicleCatalogEmpleado';
import VehicleCatalogToReserve from "../../components/EmployeeVehicleCatalogToReserve";

export default function EmployeeHome() {
    return (
        <>
            <div className="max-w-7xl mx-auto px-2 mt-10">
                <h1 className="text-4xl font-bold text-green-900 mb-6">
                    Nuestro catálogo
                </h1>
                <VehicleCatalogToReserve />
            </div>
            <div className="max-w-7xl mx-auto px-2 mt-10">
                <h1 className="text-4xl font-bold text-green-900 mb-6">
                    Bienvenido al sistema de gestión de empleados.
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                    Aquí podrás gestionar la sucursal actual.
                </p>

                {/* Componente para marcar entrega */}
                <MarkDeliveryForm />
                {/* Componente para registrar devolución */}
                <RegisterReturn />
                <h1 className="text-3xl font-bold text-green-900 mb-4">
                    Vehículos de la sucursal
                </h1>
                <VehicleCatalogEmpleado />
            </div >
        </>
    );
}