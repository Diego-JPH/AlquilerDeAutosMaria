import ReservationList from '../../components/ReservationListByBranch';

export default function ReservationsEmployeePage() {
    return (
        <div className="max-w-7xl mx-auto px-2 mt-10">
            <h1 className="text-4xl font-bold text-green-900 mb-6">
                Bienvenido al sistema de gestión de reservas
            </h1>
            <p className="text-lg text-gray-700 mb-4">
                Aquí podrás gestionar las reservas.
            </p>
            <ReservationList />
        </div>
    );
}