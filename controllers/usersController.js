const User = require('../models/user'),
  { body, validationResult } = require('express-validator'),
  { sanitizeBody } = require('express-validator'),
  bcrypt = require('bcrypt');

const getUserParams = body => {
  return {
    name: {
      first: body.first,
      last: body.last
    },
    email: body.email,
    // password: body.password,
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
    if(req.skip) next();
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) =>{
      if (user){
        req.flash("success", `${user.fullName}'s account created successfully`);
        res.locals.redirect = '/users';
        next();
      } else {
        req.flash("error", `Failed to create user account because: 
          ${error.message}.`);
        res.locals.redirect = '/users/new';
        next();
      }
    })
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
  },
  login: (req, res) => {
    res.render('users/login');
  },
  authenticate: async (req, res, next) => {
    try {
      const user = await User.findOne({
        email: req.body.email
      });
      if (user) {
        console.log(user)
        let passwordsMatch = await user.passwordComparison(req.body.password);
        if (passwordsMatch) {
          res.locals.redirect = `/users/${user._id}`;
          req.flash('success', `${user.fullName}'s logged in successfully`);
          res.locals.user = user;
          next();
        } else {
          req.flash('error', 'Failed to log in user: account: incorrect password');
          res.locals.redirect = '/users/login';
          next();
        }


      } else {
        req.flash('error', 'Failed to log in user: account: User not found');
        res.locals.redirect = '/users/login';
        next();
      }
    } catch (error) {
      console.log(`Error logging in user ${error.message}`);
      next(error);
    }
  },
  validate: async (req, res, next) => {
    body('email', 'Email is invalid').isEmail().normalizeEmail({
      all_lowercase: true
    }).trim();
    body('zipCode', 'Zip code is invalid')
      .notEmpty().isInt().isLength({
        min: 5,
        max: 5
      }).equals(req.body.zipCode);
    body('password', 'Password cannot be empty').notEmpty();

    const error = await validationResult(req);
    if (!error.isEmpty()) {
      let messages = error.array().map(e => e.msg);
      req.skip = true;
      req.flash('error', messages.join(' and '));
      res.locals.redirect = '/users/new';
      next();
    } else {
      next();
    }
  }
}
