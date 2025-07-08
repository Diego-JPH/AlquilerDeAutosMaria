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
    </div>
  );
}
