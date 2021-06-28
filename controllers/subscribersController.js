const Subscriber = require('../models/subscriber');


module.exports = {
    getAllSubscribers: async (req, res) => {
        try {
            const subscribers = await Subscriber.find({});
            res.render('subscribers', { subscribers });
        } catch (error) {
            console.log(error)
        }
    },
    getSubscriptionPage: (req, res) => {
        res.render('contact');
    },
    saveSubscriber: async (req, res) => {
        try {
            const newSubscriber = new Subscriber({
                name: req.body.name,
                email: req.body.email,
                zipCode: req.body.zipCode
            });
            await newSubscriber.save();
            res.render('thanks');
        } catch (error) {
            res.send(error);
        }

    }
}
