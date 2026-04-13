import { getSalesforceConnection } from '@/lib/salesforce';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message, vehicleName, type } = body;

    const conn = await getSalesforceConnection();

    const result = await (conn.sobject('Lead') as any).create({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Phone: phone || '',
      Company: 'Website Inquiry',
      Description: `Vehicle Interest: ${vehicleName}\n\n${message}`,
      LeadSource: 'Web',
      Status: 'New',
      Lead_Type__c: type,
    });

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json({ success: false }, { status: 500 });
    }
  } catch (error) {
    console.error('SF lead create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
