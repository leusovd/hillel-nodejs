const { Schema, model } = require("mongoose");
const { hashSync } = require('bcryptjs');

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        role: {
            type: String,
            trim: true,
            default: 'user'
        },
        name: String
    },
    {
        collection: 'users',
        timestamps: true
    }
);

// Password hashing
userSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = hashSync(this.password, 8);
    }
    next();
});

module.exports = model("UserModel", userSchema);
