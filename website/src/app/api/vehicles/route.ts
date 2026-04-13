import { getSalesforceConnection } from '@/lib/salesforce';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');

    const conn = await getSalesforceConnection();

    let query = `
      SELECT Id, Name, VIN__c, Year__c, Make__c, Model__c, Trim__c,
             Mileage__c, List_Price__c, Status__c, Days_On_Lot__c,
             Lot_Location__c, Acquisition_Date__c
      FROM Vehicle__c
      WHERE Status__c = 'Available'
    `;

    if (make) query += ` AND Make__c = '${make}'`;
    if (maxPrice) query += ` AND List_Price__c <= ${maxPrice}`;
    if (minYear) query += ` AND Year__c >= ${minYear}`;
    query += ` ORDER BY Days_On_Lot__c ASC LIMIT 100`;

    const result = await conn.query(query);
    return NextResponse.json({ success: true, vehicles: result.records });
  } catch (error) {
    console.error('SF vehicles fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}
