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

for (let i = 0; i < 15; i++) {
    const user = new User({
        name: {
            first: faker.name.firstName(),
            last: faker.name.lastName(),
        },
        email: faker.internet.email(),
        zipCode: Math.floor(Math.random() * (99999 - 10000 +1)) + 10000,
        password: faker.internet.password()
    });
    console.log(user);
    (async () => {
        try {
            await user.save();
        } catch (error) {
            console.log(error)
        }
    })();
}

