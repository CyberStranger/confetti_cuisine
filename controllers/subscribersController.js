const Subscriber = require('../models/subscriber'),
    getSubscriberParams = (body) => {
        return {
            name: body.name,
            email: body, email,
            zipCode: parseInt(body.zipCode)
        };
    };

module.exports = {
    index: async (req, res, next) => {
        try {
            const subscribers = await Subscriber.find();
            res.locals.subscribers = subscribers;
            next();
        } catch (error) {
            console.log(`Error fetching subscribers: ${error.message}`);
            next(error);
        };
    },
    indexView: (req, res) => {
        res.render('subscribers/index');
    },
    new: (req, res) => {
        res.render('subscribers/new');
    },
    create: async (req, res, next) => {
        let subscriberParams = getSubscriberParams(req.body);
        try {
            const subscriber = await Subscriber.create(subscriberParams);
            res.locals.redirect = '/subscribers';
            res.locals.subscriber = subscriber;
            next();
        } catch (error) {
            console.log(`Cannot add new subscriber ${error.message}`);
            next(error);
        }
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    show: async (req, res, next) => {
        var subscriberId = req.params.id;
        try {
            const subscriber = await Subscriber.findById(subscriberId);
            res.locals.subscriber = subscriber;
            next();
        } catch (error) {
            console.log(`Error fetching subscriber by ID: ${error.message}`);
            next(error);
        }
    },
    showView: (req, res) => {
        res.render('subscribers/show');
    },
    edit: async (req, res, next) => {
        let subscriberId = req.params.id;
        try {
            const subscriber = await Subscriber.findById(subscriberId);
            res.render('subscribers/edit', { subscriber: subscriber });
        } catch (error) {
            console.log(`Error fetching subscriber by ID: ${error.message}`);
            next(error);
        }
    },
    update: async (req, res, next) => {
        let subscriberId = req.params.id;
        const subscriberParams = getSubscriberParams(req.body);
        try {
            const subscriber = await Subscriber.findByIdAndUpdate(subscriberId, {
                $set: subscriberParams
            });
            res.locals.redirect = `/subscribers/${subscriberId}`;
            res.locals.subscriber = subscriber;
            next();
        } catch (error) {
            console.log(`Error updating subscriber by ID: ${error.message}`);
            next(error);
        }
    },
    delete: async (req, res, next) => {
        let subscriberId = req.params.id;
        try {
            await Subscriber.findOneAndRemove(subscriberId);
            res.locals.redirect = '/subscribers';
            next();
        } catch (error) {
            console.log(`Error deleting subscriber by ID: ${error.message}`);
            next(error);
        }
    }
}
