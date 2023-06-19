import mongoose from "mongoose";
import config from "../config/index.js";

const { userDB, passDB, hostDB } = config.db

const dBconnect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${userDB}:${passDB}@${hostDB}/?retryWrites=true&w=majority`);
        console.log('dB is connected');
    } catch (error) {
        console.log(error)
    }
};

export default dBconnect;