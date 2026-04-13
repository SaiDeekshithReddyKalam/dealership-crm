import { getSalesforceConnection } from '@/lib/salesforce';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await getSalesforceConnection();
    const result = await conn.query(`
      SELECT Id, Name, VIN__c, Year__c, Make__c, Model__c, Trim__c,
             Mileage__c, List_Price__c, Status__c, Days_On_Lot__c,
             Lot_Location__c, Acquisition_Date__c,
             Acquisition_Cost__c, Gross_Profit__c
      FROM Vehicle__c
      WHERE Id = '${id}'
      LIMIT 1
    `);

    if (result.records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, vehicle: result.records[0] });
  } catch (error) {
    console.error('SF vehicle detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}
