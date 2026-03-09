const fetch = require('node-fetch');

const API = 'http://localhost:5000/api';

async function testMessages() {
    try {
        console.log("1. Registering Alice...");
        const aRes = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Alice', email: `alice${Date.now()}@test.com`, password: 'pass', age: 25 })
        });
        const aData = await aRes.json();
        const aToken = aData.token;
        const aId = aData.user.id;
        console.log("Alice registered:", aData.success);

        console.log("2. Registering Bob...");
        const bRes = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Bob', email: `bob${Date.now()}@test.com`, password: 'pass', age: 28 })
        });
        const bData = await bRes.json();
        const bToken = bData.token;
        const bId = bData.user.id;
        console.log("Bob registered:", bData.success);

        console.log("3. Alice sends message to Bob...");
        const sendRes = await fetch(`${API}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aToken}`
            },
            body: JSON.stringify({ receiverId: bId, text: 'Hi Bob, it is Alice!' })
        });
        const sendData = await sendRes.json();
        console.log("Send message success:", sendData.success, sendData.message?.text);

        console.log("4. Bob fetches his active chats...");
        const chatsRes = await fetch(`${API}/messages/chats`, {
            headers: { 'Authorization': `Bearer ${bToken}` }
        });
        const chatsData = await chatsRes.json();
        console.log("Bob chats count:", chatsData.chats?.length);
        if (chatsData.chats?.length > 0) {
            console.log("First chat with:", chatsData.chats[0].userName, "Last msg:", chatsData.chats[0].lastMessage);
        }

        console.log("5. Bob fetches message history with Alice...");
        const histRes = await fetch(`${API}/messages/${aId}`, {
            headers: { 'Authorization': `Bearer ${bToken}` }
        });
        const histData = await histRes.json();
        console.log("Message history count:", histData.messages?.length);
        if (histData.messages?.length > 0) {
            console.log("History:", histData.messages.map(m => m.text));
        }

    } catch (err) {
        console.error("Test failed:", err);
    }
}

testMessages();
