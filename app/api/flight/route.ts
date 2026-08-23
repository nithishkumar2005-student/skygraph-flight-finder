import { NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(process.env.COGNODB_URI!, neo4j.auth.basic(process.env.COGNODB_USER!, process.env.COGNODB_PASSWORD!));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (src:Airport {iata: $from}), (dest:Airport {iata: $to})
      MATCH p = shortestPath((src)-[:FLIES_TO*..15]->(dest))
      RETURN nodes(p) AS airports
    `, { from, to });

    if (result.records.length === 0) return NextResponse.json([]);
    const airports = result.records[0].get('airports').map((n: any) => n.properties);
    return NextResponse.json(airports);
  } finally { await session.close(); }
}