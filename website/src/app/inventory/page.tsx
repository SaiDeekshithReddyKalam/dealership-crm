import Link from 'next/link';
import VehicleCard from '@/components/VehicleCard';
import { Vehicle } from '@/lib/types';
import { getSalesforceConnection } from '@/lib/salesforce';

async function getVehicles(make?: string, maxPrice?: string, minYear?: string): Promise<{ vehicles: Vehicle[]; error: string | null }> {
  try {
    const conn = await getSalesforceConnection();

    let query = `
      SELECT Id, Name, VIN__c, Year__c, Make__c, Model__c, Trim__c,
             List_Price__c, Status__c, Days_On_Lot__c, Acquisition_Date__c
      FROM Vehicle__c
      WHERE Status__c = 'Available'
    `;
    if (make) query += ` AND Make__c = '${make}'`;
    if (maxPrice) query += ` AND List_Price__c <= ${maxPrice}`;
    if (minYear) query += ` AND Year__c >= ${minYear}`;
    query += ` ORDER BY Days_On_Lot__c ASC LIMIT 100`;

    const result = await conn.query(query);
    return { vehicles: result.records as Vehicle[], error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('SF fetch error:', message);
    return { vehicles: [], error: message };
  }
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const { vehicles, error } = await getVehicles(params.make, params.maxPrice, params.minYear);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Inventory</h1>
      <p className="text-gray-500 mb-8">{vehicles.length} vehicles available</p>

      <div className="flex gap-3 mb-8 flex-wrap">
        {[
          { label: 'Toyota', href: '/inventory?make=Toyota', active: params.make === 'Toyota' },
          { label: 'Honda',  href: '/inventory?make=Honda',  active: params.make === 'Honda' },
          { label: 'Ford',   href: '/inventory?make=Ford',   active: params.make === 'Ford' },
          { label: 'Under $20k', href: '/inventory?maxPrice=20000', active: params.maxPrice === '20000' },
          { label: 'Under $30k', href: '/inventory?maxPrice=30000', active: params.maxPrice === '30000' },
          { label: 'Show all',   href: '/inventory', active: !params.make && !params.maxPrice },
        ].map(({ label, href, active }) => (
          <Link key={label} href={href}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active ? 'bg-gray-900 text-white border-gray-900' : 'hover:bg-gray-50'
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <strong>Salesforce connection error:</strong> {error}
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No vehicles found.</p>
          <p className="text-sm mt-2">Make sure your Salesforce org has vehicles with Status = Available.</p>
          <Link href="/inventory" className="text-blue-600 text-sm mt-2 block">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => <VehicleCard key={v.Id} vehicle={v} />)}
        </div>
      )}
    </main>
    
  );
}
