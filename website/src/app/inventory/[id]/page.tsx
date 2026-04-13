import InquiryForm from '@/components/InquiryForm';
import { Vehicle } from '@/lib/types';
import { getSalesforceConnection } from '@/lib/salesforce';
import { notFound } from 'next/navigation';

async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const conn = await getSalesforceConnection();
    const result = await conn.query(`
      SELECT Id, Name, VIN__c, Year__c, Make__c, Model__c, Trim__c,
             List_Price__c, Status__c, Days_On_Lot__c, Acquisition_Date__c
      FROM Vehicle__c
      WHERE Id = '${id}'
      LIMIT 1
    `);
    if (result.records.length === 0) return null;
    return result.records[0] as Vehicle;
  } catch (error) {
    console.error('SF vehicle detail error:', error);
    return null;
  }
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  const vehicleName = `${vehicle.Year__c} ${vehicle.Make__c} ${vehicle.Model__c}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <a href="/inventory" className="text-sm text-blue-600 hover:underline mb-6 block">
        ← Back to inventory
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="h-72 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
            <span className="text-7xl text-gray-300">🚗</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{vehicleName}</h1>
          {vehicle.Trim__c && (
            <p className="text-gray-500 mt-1">{vehicle.Trim__c}</p>
          )}
          <p className="text-4xl font-bold text-blue-600 mt-4">
            ${vehicle.List_Price__c?.toLocaleString()}
          </p>

          {vehicle.Days_On_Lot__c > 45 && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
              On lot for {vehicle.Days_On_Lot__c} days — ask about special pricing.
            </div>
          )}

          <div className="mt-6 rounded-xl border divide-y">
            {[
              { label: 'VIN', value: vehicle.VIN__c, mono: true },
              { label: 'Year', value: vehicle.Year__c },
              { label: 'Make', value: vehicle.Make__c },
              { label: 'Model', value: vehicle.Model__c },
              { label: 'Trim', value: vehicle.Trim__c },
              { label: 'Mileage', value: `${vehicle.Mileage__c?.toLocaleString()} mi` },
              { label: 'Status', value: vehicle.Status__c },
              { label: 'Location', value: vehicle.Lot_Location__c || 'Main lot' },
            ].map((row) => row.value ? (
              <div key={row.label} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-gray-500">{row.label}</span>
                <span className={`font-medium ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
              </div>
            ) : null)}
          </div>
        </div>

        <div>
          <InquiryForm vehicleId={vehicle.Id} vehicleName={vehicleName} />
        </div>
      </div>
    </main>
  );
}
