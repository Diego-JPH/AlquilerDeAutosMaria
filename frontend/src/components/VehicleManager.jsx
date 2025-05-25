import UpdateVehicleForm from './UpdateVehicleForm';
import DeleteVehicleForm from './DeleteVehicleForm';
import InsertVehicleForm from './InsertVehicleForm';

export default function VehicleManager() {
  return (
    <div className="space-y-8">
      {/* Formulario para agregar (arriba y ancho completo) */}
      <div>
        <InsertVehicleForm />
      </div>

      {/* Filas con formularios de actualizar y eliminar (mitad y mitad) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UpdateVehicleForm />
        <DeleteVehicleForm />
      </div>
    </div>
  );
}
