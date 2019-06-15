const mongoose = require("mongoose");
const config   = require("config"); // módulo instalado

const db     = config.get("mongoURI");

const connectDB = async ()=>{
    try
    {
        await mongoose.connect(db,{ useNewUrlParser: true, useCreateIndex: true });
        console.log("MongoDB connected");
    }
    catch(err){
        console.log(err.message);
        //Encerra o processo em caso de falha na conexão
        process.exit(1);
    }
}

module.exports = connectDB;

    

