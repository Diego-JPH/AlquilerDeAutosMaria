import AmountInPeriod from '../../components/AmountInPeriod';
import GetVehiclesReserved from '../../components/GetVehiclesReserved';

export default function AdminHome() {
  return (
    <div className="max-w-7xl mx-auto px-2 mt-10">
      <h1 className="text-4xl font-bold text-green-900 mb-6">
        Métricas de la empresa
      </h1>
      <AmountInPeriod />
      <GetVehiclesReserved />
    </div>
  );
}
