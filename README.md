# SkyGraph ✈️ | Global Flight Intelligence Platform

SkyGraph is a high-performance flight pathfinding application built for the **Wexa AI Software Developer Intern Assessment**. It utilizes **CognoDB** (a managed graph database) to solve complex routing problems across a global network of remote and hub airports.

## 🚀 Project Flow
1. **Discovery:** The user explores available airport hubs in the "Discovery Sidebar."
2. **Selection:** The user selects an **Origin** (e.g., Thule, Greenland) and a **Destination** (e.g., Goroka, Papua New Guinea).
3. **Traversal Engine:** Upon clicking "Analyze Traversal," the frontend sends a request to a Next.js API route.
4. **Graph Query:** The API executes a **Cypher `shortestPath` query** via the official Neo4j driver to CognoDB Cloud.
5. **Real-time Mapping:** The database traverses relationships (edges) to find the most efficient path, which is then rendered as a visual timeline on the UI.

## ❓ Why a Graph Database?
This project demonstrates why graph databases are superior for networking use cases:
- **Relational (SQL) Limitation:** To find a route with 6 layovers, a SQL database would require 7 expensive table joins, causing performance lag.
- **Graph Advantage:** In CognoDB, relationships are stored physically. Finding a path is a simple "pointer hopping" operation.
- **Natural Modeling:** Flight routes are naturally a graph. Modeling them as Nodes (`Airport`) and Relationships (`FLIES_TO`) is more intuitive than rigid tables.

## 📊 Data Model
- **Nodes (`:Airport`)**: Properties include `iata`, `name`, `city`, and `country`.
- **Relationships (`:FLIES_TO`)**: Bidirectional edges representing a flight connection.

### The "Killer" Query (Multi-hop Traversal)
This query solves the complex pathfinding problem in a single step:
```cypher
MATCH (src:Airport {iata: $from}), (dest:Airport {iata: $to})
MATCH p = shortestPath((src)-[:FLIES_TO*..15]->(dest))
RETURN nodes(p) AS airports
