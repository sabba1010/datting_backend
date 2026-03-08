async function runTests() {
    const BASE = 'http://localhost:5000/api';
    const timestamp = Date.now();
    const email = `test${timestamp}@test.com`;

    console.log('=== REGISTER ===');
    const r1 = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'TestUser', email, password: 'pass123' })
    });
    const d1 = await r1.json();
    console.log('Status:', r1.status, '| Success:', d1.success, '| Token:', d1.token ? 'present' : 'MISSING');
    const token = d1.token;

    console.log('\n=== LOGIN ===');
    const r2 = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'pass123' })
    });
    const d2 = await r2.json();
    console.log('Status:', r2.status, '| Success:', d2.success, '| User:', d2.user?.name);

    console.log('\n=== UPDATE PROFILE ===');
    const r3 = await fetch(`${BASE}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ gender: 'man', lookingFor: 'woman', ageRange: '25–35', location: 'Paris', age: 28 })
    });
    const d3 = await r3.json();
    console.log('Status:', r3.status, '| Success:', d3.success, '| Gender:', d3.user?.gender);

    console.log('\n=== MATCHES ===');
    const r4 = await fetch(`${BASE}/users/matches?ageRange=25–35`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const d4 = await r4.json();
    console.log('Status:', r4.status, '| Success:', d4.success, '| Count:', d4.count);

    console.log('\n=== WRONG PASSWORD ===');
    const r5 = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'wrongpass' })
    });
    const d5 = await r5.json();
    console.log('Status:', r5.status, '| Message:', d5.message);

    console.log('\n✅ All tests complete!');
}

runTests();
