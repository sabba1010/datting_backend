const fetch = require('node-fetch');

async function testFullFlow() {
    const API = "http://localhost:5000/api";
    const timestamp = Date.now();
    const email = `flow_test_${timestamp}@example.com`;
    const password = "password123";
    
    try {
        console.log('--- 1. REGISTER ---');
        const regRes = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "Flow User", email, password, age: 30 })
        });
        const regData = await regRes.json();
        console.log('Reg Status:', regRes.status);
        console.log('Reg Data:', JSON.stringify(regData, null, 2));

        if (regRes.status !== 201) {
            console.error('Registration failed!');
            return;
        }

        console.log('\n--- 2. LOGIN ---');
        const loginRes = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Data:', JSON.stringify(loginData, null, 2));

        if (loginRes.status === 200 && loginData.success) {
            console.log('\nFULL FLOW SUCCESSFUL');
        } else {
            console.log('\nLOGIN FAILED AFTER REGISTRATION');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testFullFlow();
