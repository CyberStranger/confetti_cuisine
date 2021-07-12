const express = require('express'),
    router = express.Router(),
    methodOverride = require('method-override'),
    homeController = require('./controllers/homeController'),
    errorController = require('./controllers/errorController'),
    subscribersController = require('./controllers/subscribersController'),
    usersController = require('./controllers/usersController'),
    layouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    app = express();

mongoose.connect(
    'mongodb://localhost:27017/confetti_cuisine', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

router.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));

app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());
app.use(layouts);
app.use('/', router)

app.get('/', (req, res) => {
    res.send('Welcome to Confetti Cuisine');
});

router.get('/users', usersController.index, usersController.indexView);
router.get('/users/:id', usersController.show, usersController.showView);
router.get('/users/new', usersController.new);
router.post('/users/create', usersController.create, usersController.redirectView);
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
* next page 266
*/