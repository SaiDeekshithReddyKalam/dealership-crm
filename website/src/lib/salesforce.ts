import * as jsforce from 'jsforce';

let conn: jsforce.Connection | null = null;

export async function getSalesforceConnection(): Promise<jsforce.Connection> {
  if (conn && conn.accessToken) return conn;

  conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com',
  });

  await conn.login(
    process.env.SF_USERNAME!,
    process.env.SF_PASSWORD! + process.env.SF_SECURITY_TOKEN!
  );

  return conn;
}
