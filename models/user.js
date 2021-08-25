const mongoose = require('mongoose'),
  { Schema } = mongoose,
  // bcrypt = require('bcrypt'),
  Subscriber = require('./subscriber'),
  passportLocalMongoose = require('passport-local-mongoose');

userSchema = new Schema({
  name: {
    first: {
      type: String,
      trim: true,
    },
    last: {
      type: String,
      trim: true,
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  zipCode: {
    type: Number,
    min: [10000, 'Zip code too short'],
    max: 99999
  },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  subscribedAccount: { type: Schema.Types.ObjectId, ref: 'Subscriber' }
}, {
  timestamps: true
});

userSchema.virtual('fullName')
  .get(function () {
    return `${this.name.first} ${this.name.last}`;
  });


// userSchema.pre('save', async function (next) {
//   let user = this;

//   try {
//     const hash = await bcrypt.hash(user.password, 10);
//     user.password = hash;
//     next();
//   } catch (error) {
//     console.log(`Error in hashing password: ${error.message}`);
//     next(error);
//   }
// });

userSchema.pre('save', async function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    try {
      let subs = await Subscriber.findOne({ email: user.email });
      user.subscribedAccount = subs;
      next();
    } catch (error) {
      console.log(`Somthing gonna wrong ${error.message}`);
      next(error);
    }
  } else {
    next();
  }
});

// userSchema.methods.passwordComparison = function(inputPassword) {
//   let user = this;
//   return bcrypt.compare(inputPassword, user.password);
// }

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model('User', userSchema);
