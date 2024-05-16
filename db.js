const mongoose = require('mongoose');
let URL = "mongodb://127.0.0.1:27017/shortner"
console.log("Excuting");
const connectDB = async () => {
    await mongoose.connect(URL).then(() => {
        console.log("Connected")
    }).catch((err) => {
        console.log("error in connection");
    })
}
connectDB();
module.exports = { connectDB };
