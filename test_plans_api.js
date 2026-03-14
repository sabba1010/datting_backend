async function testPlans() {
    try {
        const res = await fetch('http://localhost:5000/api/plans');
        const data = await res.json();
        console.log('Plans Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}
testPlans();
