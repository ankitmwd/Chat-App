import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName:process.env.MONGO_DATABASE
        }
        )
        console.log("Mongoose Connect " + conn.connection.host);
    }
    catch(err){
            console.log(err)
        }
}
export default connectDB;