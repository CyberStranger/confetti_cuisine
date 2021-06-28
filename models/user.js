const mongoose = require('mongoose'),
    { Schema } = mongoose,
    Subscriber = require('./subscriber');

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
            min: [10000, 'Zip code too short']
        },
        password: {
            type: String,
            required: true
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

userSchema.pre('save', async function(next) {
    let user = this;
    if(user.subscribedAccount === undefined) {
        try {
            let subs = await Subscriber.findOne({email: user.email});
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

module.exports = mongoose.model('User', userSchema);
