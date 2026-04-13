import Link from 'next/link';
import { Vehicle } from '@/lib/types';

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/inventory/${vehicle.Id}`}
      className="block rounded-xl border bg-white hover:shadow-md transition-shadow">
      <div className="h-48 rounded-t-xl bg-gray-100 flex items-center justify-center">
        <span className="text-4xl text-gray-300">🚗</span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">
          {vehicle.Year__c} {vehicle.Make__c} {vehicle.Model__c}
        </h3>
        {vehicle.Trim__c && (
          <p className="text-sm text-gray-500">{vehicle.Trim__c}</p>
        )}
        <p className="text-xl font-bold text-blue-600">
          ${vehicle.List_Price__c?.toLocaleString()}
        </p>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>{vehicle.Mileage__c?.toLocaleString()} mi</span>
          <span>{vehicle.Days_On_Lot__c} days on lot</span>
        </div>
        {vehicle.Days_On_Lot__c > 45 && (
          <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
            Price reduced
          </span>
        )}
      </div>
    </Link>
  );
}
