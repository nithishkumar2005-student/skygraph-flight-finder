import { NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(process.env.COGNODB_URI!, neo4j.auth.basic(process.env.COGNODB_USER!, process.env.COGNODB_PASSWORD!));

export async function GET() {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (a:Airport) RETURN a.iata AS iata, a.city AS city, a.country AS country ORDER BY a.city ASC');
    const airports = result.records.map(r => ({ iata: r.get('iata'), city: r.get('city'), country: r.get('country') }));
    return NextResponse.json(airports);
  } finally { await session.close(); }
}