import { Database } from "bun:sqlite";
const db = new Database("/root/sites/mtt.bratuxa.zomb.top/data/mtt.db");

// Check scores table for Runduk
const rows = db.query("SELECT * FROM scores WHERE login = ? OR nick = ? ORDER BY ts").all("Runduk", "Runduk");
console.log(`=== SCORES for Runduk: ${rows.length} rows ===`);
console.log(JSON.stringify(rows, null, 2));

// Also search partial match
const partial = db.query("SELECT * FROM scores WHERE login LIKE '%runduk%' OR nick LIKE '%runduk%' ORDER BY ts").all();
console.log(`\n=== PARTIAL match 'runduk': ${partial.length} rows ===`);
console.log(JSON.stringify(partial, null, 2));

// Check all unique logins to find similar names
const allLogins = db.query("SELECT DISTINCT login FROM scores ORDER BY login").all();
console.log(`\n=== ALL logins (${allLogins.length}) ===`);
console.log(allLogins.map(r => r.login).join(", "));

// Top scores
const top = db.query("SELECT nick, score, coins, login, ts FROM scores ORDER BY score DESC LIMIT 20").all();
console.log(`\n=== TOP 20 scores ===`);
console.log(JSON.stringify(top, null, 2));
