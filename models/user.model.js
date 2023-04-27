const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String, required: false
    },
    firstName: {
        type: String, required: true
    },
    lastName: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    mobile_no: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    role_type: {
        type: String, required: true
    },
    status: {
        type: Boolean, required: true
    }
}, {
    collation: { locale: 'en_US', strength: 1 },
    usePushEach: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

userSchema.options.toJSON = {
    transfrom: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id
        delete ret.__v;
        return ret
    }
}

userSchema.statics.addCity = (city) => {
    return userSchema.create(city)
}

userSchema.statics.getCity = () => {
    return userSchema.find({})
}


const User = mongoose.model('User', userSchema)

module.exports = User

