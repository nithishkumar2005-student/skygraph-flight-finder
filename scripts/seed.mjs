import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USER, process.env.COGNODB_PASSWORD)
);

async function seed() {
  const session = driver.session();
  try {
    console.log("Cleaning DB...");
    await session.run('MATCH (n) DETACH DELETE n');

    console.log("Seeding 10 Bidirectional Hubs...");
    await session.run(`
      CREATE (gka:Airport {iata: 'GKA', name: 'Goroka', city: 'Goroka', country: 'Papua New Guinea'})
      CREATE (mag:Airport {iata: 'MAG', name: 'Madang', city: 'Madang', country: 'Papua New Guinea'})
      CREATE (hgu:Airport {iata: 'HGU', name: 'Mount Hagen', city: 'Mount Hagen', country: 'Papua New Guinea'})
      CREATE (lae:Airport {iata: 'LAE', name: 'Nadzab', city: 'Nadzab', country: 'Papua New Guinea'})
      CREATE (pom:Airport {iata: 'POM', name: 'Port Moresby', city: 'Port Moresby', country: 'Papua New Guinea'})
      CREATE (wwk:Airport {iata: 'WWK', name: 'Wewak', city: 'Wewak', country: 'Papua New Guinea'})
      CREATE (uak:Airport {iata: 'UAK', name: 'Narsarsuaq', city: 'Narssarssuaq', country: 'Greenland'})
      CREATE (goh:Airport {iata: 'GOH', name: 'Nuuk', city: 'Godthaab', country: 'Greenland'})
      CREATE (sfj:Airport {iata: 'SFJ', name: 'Kangerlussuaq', city: 'Sondrestrom', country: 'Greenland'})
      CREATE (thu:Airport {iata: 'THU', name: 'Thule Air Base', city: 'Thule', country: 'Greenland'})

      // Greenland Chain (Two-Way)
      MERGE (thu)-[:FLIES_TO]->(sfj) MERGE (sfj)-[:FLIES_TO]->(thu)
      MERGE (sfj)-[:FLIES_TO]->(goh) MERGE (goh)-[:FLIES_TO]->(sfj)
      MERGE (goh)-[:FLIES_TO]->(uak) MERGE (uak)-[:FLIES_TO]->(goh)
      
      // The Global Bridge (Two-Way)
      MERGE (uak)-[:FLIES_TO]->(pom) MERGE (pom)-[:FLIES_TO]->(uak)
      
      // PNG Chain (Two-Way)
      MERGE (pom)-[:FLIES_TO]->(lae) MERGE (lae)-[:FLIES_TO]->(pom)
      MERGE (lae)-[:FLIES_TO]->(hgu) MERGE (hgu)-[:FLIES_TO]->(lae)
      MERGE (hgu)-[:FLIES_TO]->(mag) MERGE (mag)-[:FLIES_TO]->(hgu)
      MERGE (mag)-[:FLIES_TO]->(wwk) MERGE (wwk)-[:FLIES_TO]->(mag)
      MERGE (wwk)-[:FLIES_TO]->(gka) MERGE (gka)-[:FLIES_TO]->(wwk)
    `);
    console.log("✅ Database Ready: All 10 locations connected!");
  } finally {
    await session.close();
    await driver.close();
  }
}
seed();