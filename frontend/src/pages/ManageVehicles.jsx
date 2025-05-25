import React from 'react';
import VehicleManager from '../components/VehicleManager';

const ManageVehicles = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-900">Gestión de Vehículos</h1>
      <VehicleManager />
    </div>
  );
};

export default ManageVehicles;