const mongoose = require('mongoose'),
    Course = require('./models/course'),
    Subscriber = require('./models/subscriber');


mongoose.connect(
    'mongodb://localhost:27017/confetti_cuisine', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

let testCourse, testSubscriber;
(async () => {
    testSubscriber = await Subscriber.create({
        name: 'Jon Doe',
        email: 'Jon@hotmail.com',
        zipCode: 12345
    })
    testCourse = await Course.create({
        title: 'Tomato Land',
        description: 'Locally farmed tomatoes only',
        zipCode: 12345,
        items: ['cherry', 'heirloom']
    })
    console.log(testSubscriber);
    testSubscriber.courses.push(testCourse);
    testSubscriber.save();

    let sub = await Subscriber.findOne({}).populate('courses');
    console.log(sub);
    // await Subscriber.deleteMany({});
    // await Course.deleteMany({});
    await mongoose.disconnect();
})();
