// test login via API
const BASE = 'http://localhost:8095';

async function test() {
  // test login with wrong password
  let r = await fetch(`${BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: 'MTT', pass: 'wrongpass' }),
  });
  console.log('Login wrong pass:', r.status, await r.json());

  // test register
  r = await fetch(`${BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: 'test_check_123', pass: 'test1234' }),
  });
  console.log('Register:', r.status, await r.json());

  // check dev/users
  // get dev token first
  r = await fetch(`${BASE}/api/dev/top-scores?token=LXX42P2ILX`);
  console.log('Dev top-scores:', r.status, (await r.json()).ok);
}

test().catch(console.error);
