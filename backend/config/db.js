const mongoose = require("mongoose")
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
// connection

const conn = async() => {
    try {
        const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.gmcruqt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster00`);
        console.log("Conectou ao banco!")
        return dbConn
    } catch (error) {
        console.log(error);
    }
}

conn()

module.exports = conn;
