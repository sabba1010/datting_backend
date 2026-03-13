const fetch = require('node-fetch');

async function testRegistration() {
    const API = "http://localhost:5000/api";
    const timestamp = Date.now();
    const email = `test_bug_${timestamp}@example.com`;
    
    console.log(`Attempting to register: ${email}`);
    
    try {
        const response = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Bug User",
                email: email,
                password: "password123",
                age: 25
            })
        });
        
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
        
        if (response.status === 201 && data.success) {
            console.log('Registration SUCCESSFUL');
        } else {
            console.log('Registration FAILED');
        }
    } catch (err) {
        console.error('Network Error:', err.message);
    }
}

testRegistration();
