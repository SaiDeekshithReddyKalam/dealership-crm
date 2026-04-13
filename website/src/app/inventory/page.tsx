import Link from 'next/link';
import VehicleCard from '@/components/VehicleCard';
import { Vehicle } from '@/lib/types';
import { getSalesforceConnection } from '@/lib/salesforce';

async function getVehicles(make?: string, maxPrice?: string, minYear?: string): Promise<Vehicle[]> {
  try {
    const conn = await getSalesforceConnection();

    let query = `
      SELECT Id, Name, VIN__c, Year__c, Make__c, Model__c, Trim__c,
             List_Price__c, Status__c, Days_On_Lot__c, Acquisition_Date__c
      FROM Vehicle__c
      WHERE Status__c IN ('Listed', 'Available', 'In Stock')
    `;
    if (make) query += ` AND Make__c = '${make}'`;
    if (maxPrice) query += ` AND List_Price__c <= ${maxPrice}`;
    if (minYear) query += ` AND Year__c >= ${minYear}`;
    query += ` ORDER BY Days_On_Lot__c ASC LIMIT 100`;

    const result = await conn.query(query);
    return result.records as Vehicle[];
  } catch (error) {
    console.error('SF fetch error:', error);
    return [];
  }
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const vehicles = await getVehicles(params.make, params.maxPrice, params.minYear);

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

      {vehicles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No vehicles found.</p>
          <p className="text-sm mt-2">Make sure your Salesforce org has vehicles with Status = Listed.</p>
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
