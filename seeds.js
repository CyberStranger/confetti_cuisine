const mongoose = require('mongoose'),
    faker = require('faker'),
    User = require('./models/user');

try {
    mongoose.connect(
        'mongodb://localhost:27017/confetti_cuisine', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
} catch (error) {
    console.log('something wrong with connection', error.message);
}

(async () => {
    for (let i = 0; i < 15; i++) {
        const user = await User.register({
            name: {
                first: faker.name.firstName(),
                last: faker.name.lastName(),
            },
            email: faker.internet.email(),
            zipCode: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
        }, faker.internet.password(), (error, user) => {
            if (user) {
                console.log(`User created successfully ${user}`);
            } else {
                console.log(`something went wrong ${error.message}`);
            }
        });
    }
})();
