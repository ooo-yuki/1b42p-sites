import { Database } from "bun:sqlite";
const db = new Database("/tmp/mtt_real.db");

const users = db.query("SELECT login FROM users").all();
console.log("=== ALL USERS ===");
console.log(users.map(u => u.login).join(", ") || "(пусто)");

const nicks = db.query("SELECT DISTINCT nick FROM scores").all();
console.log("\n=== ALL NICKS ===");
console.log(nicks.map(n => n.nick).join(", "));

const logins = db.query("SELECT DISTINCT login FROM scores WHERE login != ''").all();
console.log("\n=== SCORE LOGINS ===");
console.log(logins.map(l => l.login).join(", ") || "(пусто)");

const likeR = db.query("SELECT * FROM scores WHERE nick LIKE '%rund%' OR login LIKE '%rund%' ORDER BY ts").all();
console.log("\n=== LIKE 'rund' ===");
console.log(JSON.stringify(likeR, null, 2));

const top = db.query("SELECT nick, MAX(score) AS score, MAX(coins) AS coins, login FROM scores GROUP BY CASE WHEN login != '' THEN 'L:' || login ELSE 'N:' || nick END ORDER BY score DESC LIMIT 10").all();
console.log("\n=== TOP 10 ===");
console.log(JSON.stringify(top, null, 2));

const cnt = db.query("SELECT count(*) as c FROM scores").get();
console.log("\nTotal score rows:", cnt.c);

// Все уникальные ники с количеством записей
const allNicks = db.query("SELECT nick, count(*) as cnt, MAX(score) as best, login FROM scores GROUP BY nick ORDER BY best DESC").all();
console.log("\n=== ALL NICKS WITH STATS ===");
console.log(JSON.stringify(allNicks, null, 2));
