import mongoose from "mongoose";

const connectDatabase = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected to '${mongoose.connection.name}' DB`);
};

export default connectDatabase;
