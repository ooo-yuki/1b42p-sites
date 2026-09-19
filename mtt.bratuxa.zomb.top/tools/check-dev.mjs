import { Database } from 'bun:sqlite';
const db = new Database('/tmp/mtt_check.db');
console.log('dev_blocked:', JSON.stringify(db.query('SELECT * FROM dev_blocked').all()));
console.log('ip_blocked:', JSON.stringify(db.query('SELECT * FROM ip_blocked').all()));
console.log('ip_log:', JSON.stringify(db.query('SELECT COUNT(*) as c FROM ip_log').get()));
console.log('users:', JSON.stringify(db.query('SELECT COUNT(*) as c FROM users').get()));
// Show all users with blocked status
const users = db.query('SELECT login, created FROM users ORDER BY created DESC').all();
for (const u of users) {
  const b = db.query('SELECT login FROM dev_blocked WHERE login = ?').get(u.login);
  console.log(`  ${u.login}: blocked=${!!b}`);
}
