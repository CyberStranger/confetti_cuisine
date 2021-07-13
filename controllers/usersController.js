const User = require('../models/user');

const getUserParams = body => {
  return {
    name: {
      first: body.first,
      last: body.last
    },
    email: body.email,
    password: body.password,
    zipCode: body.zipCode
  }
}
module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find({});
      res.locals.users = users;
      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  },
  indexView: (req, res) => {
    res.render('users/index', {
      flashMessages: {
        success: 'Loaded all users!'
      }
    });
  },
  new: (req, res) => {
    res.render('users/new')
  },
  create: async (req, res, next) => {
    let userParams = getUserParams(req.body);

    try {
      const user = await User.create(userParams);
      req.flash('success', `${user.fullName}'s account created successfully!`);
      res.locals.redirect = "/users";
      res.locals.user = user;
      next();
    } catch (error) {
      console.log(`Error saving user: ${error.message}`);
      res.locals.redirect = '/users/new';
      req.flash(
        'error', 
        `Failed to create user account because: ${error.message}.`);
      next();
    }

  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: async (req, res, next) => {
    let userId = req.params.id;
    try {
      const user = await User.findById(userId);
      res.locals.user = user;
      next();
    } catch (error) {
      console.log(`Something gonna wrong: ${error.message}`);
      next(error);
    }

  },
  showView: (req, res) => {
    res.render('users/show');
  },
  edit: async (req, res, next) => { //Show edit form
    let userId = req.params.id;
    try {
      const user = await User.findById(userId);
      res.render('users/edit', { user: user });
    } catch (error) {
      console.log(`Error fetching user by ID ${error.message}`);
      next(error);
    }
  },
  update: async (req, res, next) => {
    let userId = req.params.id;
    const userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    try {
      res.locals.redirect = `/users/${userId}`;
      res.locals.user = await User.findByIdAndUpdate(userId, { $set: userParams });
      req.flash('success', 'User data has been modified')
      next();
    } catch (error) {
      console.log(`Error updating User by ID, ${error.message}`);
      next(error);
    }
  },
  delete: async (req, res, next) => {
    let userId = req.params.id;
    try {
      await User.findByIdAndDelete(userId);
      req.flash('success', 'User has been deleted');
      res.locals.redirect = '/users';
      next();
    } catch (error) {
      console.log(`Error deleting user by ID: ${error.message}`);
      next();
    }
  }
}
