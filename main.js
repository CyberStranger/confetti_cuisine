const express = require('express'),
    router = express.Router(),
    User = require('./models/user'),
    methodOverride = require('method-override'),
    homeController = require('./controllers/homeController'),
    errorController = require('./controllers/errorController'),
    subscribersController = require('./controllers/subscribersController'),
    usersController = require('./controllers/usersController'),
    layouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    expressSession = require('express-session'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    connectFlash = require('connect-flash'),
    // LocalStrategy = require('passport-local'),
    app = express();

mongoose.connect(
    'mongodb://localhost:27017/confetti_cuisine', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
});

router.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));
router.use(cookieParser('secret_passcode'));
router.use(connectFlash());
router.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});


app.use(expressSession({
    secret: 'secret_passcode',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 4000000,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(User.createStrategy());
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
   next();
})

app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());
app.use(layouts);
app.use('/', router);


app.get('/', (req, res) => {
    res.send('Welcome to Confetti Cuisine');
});

router.get('/users', usersController.index, usersController.indexView);
router.get('/users/new', usersController.new);
router.get('/users/login', usersController.login);
router.post('/users/login', usersController.authenticate);
router.get('/users/logout', usersController.logout, usersController.redirectView);
router.post('/users/create', usersController.validate, usersController.create, usersController.redirectView);
router.get('/users/:id', usersController.show, usersController.showView);
router.get('/users/:id/edit', usersController.edit);
router.put('/users/:id/update', usersController.update, usersController.redirectView);
router.delete('/users/:id/delete', usersController.delete, usersController.redirectView);

router.get('/courses', homeController.showCourses);

router.get('/subscribers', subscribersController.index, subscribersController.indexView);
router.get('/subscribers/new', subscribersController.new);
router.post('/subscribers/create', subscribersController.create, subscribersController.redirectView);
router.get('/subscribers/:id', subscribersController.show, subscribersController.showView);
router.get('/subscribers/:id/edit', subscribersController.edit);
router.put('/subscribers/:id/update', subscribersController.update, subscribersController.redirectView);
router.delete('/subscribers/:id/delete', subscribersController.delete, subscribersController.redirectView);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get('port'), () => {
    console.log(
        `Server running at http://localhost:${app.get('port')}`
    );
});
/* TODO: Переместить confetti_cuisine из Unit2 в директорию верхнего уровня
* next page 304
*/