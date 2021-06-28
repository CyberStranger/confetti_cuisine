const { model, Schema } = require('mongoose');

subscriberSchema =new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    zipCode: {
        type: Number,
        min: [10000, 'Zip code is too short'],
        max: 99999
    },
    courses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
});

subscriberSchema.methods.getInfo = function() {
    return `Name: ${this.name} 
        Email: ${this.email} Zip Code: ${this.zipCode}`;
};

subscriberSchema.methods.findLocalSubscribers = async function() {
    return await this.model('Subscriber')
        .find({zipCode: this.zipCode});
}

module.exports = model('Subscriber', subscriberSchema);