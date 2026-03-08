const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function seedAndTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create mock users
        const password = await bcrypt.hash('pass123', 10);

        const users = await User.create([
            {
                name: "Lucas", email: "lucas@test.com", password,
                gender: "man", lookingFor: "woman", age: 28, ageRange: "25–35", location: "Paris"
            },
            {
                name: "Emma", email: "emma@test.com", password,
                gender: "woman", lookingFor: "man", age: 26, ageRange: "25–35", location: "Paris"
            },
            {
                name: "Sophie", email: "sophie@test.com", password,
                gender: "woman", lookingFor: "man", age: 32, ageRange: "25–35", location: "Lyon"
            },
            {
                name: "Thomas", email: "thomas@test.com", password,
                gender: "man", lookingFor: "woman", age: 30, ageRange: "25–35", location: "Paris"
            },
            {
                name: "Julie", email: "julie@test.com", password,
                gender: "woman", lookingFor: "woman", age: 27, ageRange: "18–25", location: "Paris"
            }
        ]);
        console.log(`Created ${users.length} users`);

        // Test matching for Lucas
        const lucas = users[0];
        console.log(`\nTesting matches for ${lucas.name} (Gender: ${lucas.gender}, Looking for: ${lucas.lookingFor}, Age: ${lucas.age}, AgePrefs: ${lucas.ageRange}, Location: ${lucas.location})`);

        // Emulate the controller logic
        const currentUser = lucas;
        const reqAgeRange = currentUser.ageRange;
        let minAge = 18, maxAge = 100;
        if (reqAgeRange === '18-25' || reqAgeRange === '18–25') { minAge = 18; maxAge = 25; }
        else if (reqAgeRange === '25-35' || reqAgeRange === '25–35') { minAge = 25; maxAge = 35; }
        else if (reqAgeRange === '35-45' || reqAgeRange === '35–45') { minAge = 35; maxAge = 45; }
        else if (reqAgeRange === '45+') { minAge = 45; maxAge = 100; }

        console.log(`Querying age range: ${minAge} to ${maxAge}`);

        const query = {
            _id: { $ne: currentUser._id },
            gender: currentUser.lookingFor, // Has to be a woman
        };

        if (minAge > 18 || maxAge < 100) {
            query.age = { $gte: minAge, $lte: maxAge };
        }

        console.log('Query:', JSON.stringify(query));

        const matches = await User.find(query);
        console.log(`Found ${matches.length} DB matches for Lucas:`);
        matches.forEach(m => console.log(` - ${m.name} (Age: ${m.age}, Gender: ${m.gender}, LookingFor: ${m.lookingFor})`));

        // Test Emma
        const emma = users[1];
        console.log(`\nTesting matches for ${emma.name} (Gender: ${emma.gender}, Looking for: ${emma.lookingFor}, Age: ${emma.age}, AgePrefs: ${emma.ageRange}, Location: ${emma.location})`);
        const queryEmma = {
            _id: { $ne: emma._id },
            gender: emma.lookingFor
        };
        queryEmma.age = { $gte: 25, $lte: 35 };
        const matchesEmma = await User.find(queryEmma);
        console.log(`Found ${matchesEmma.length} DB matches for Emma:`);
        matchesEmma.forEach(m => console.log(` - ${m.name} (Age: ${m.age}, Gender: ${m.gender}, LookingFor: ${m.lookingFor})`));

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

seedAndTest();
