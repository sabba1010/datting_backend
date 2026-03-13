async function testPlans() {
    try {
        const res = await fetch('https://amour-et-sincerite.com/api/api/plans');
        const data = await res.json();
        console.log('Plans Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}
testPlans();
