import mongoose from "mongoose";

const userCollection = 'user';

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    cart: String,
    role: {
        type: String,
        default: 'user'
    }
})

const User = mongoose.model(userCollection, userSchema);

export default User;