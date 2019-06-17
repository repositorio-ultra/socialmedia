const express   = require("express");
const app       = express();
const connectDB = require("./config/db");

const PORT    = process.env.PORT || 5000;

// Connect DB
connectDB();


// Main route
app.get("/", (request,response)=>{
    response.send("API running...");
})

// Middlewares
// Não é mais necessário importar o módulo body-parser, pois já está incluso no express
app.use(express.json()); //Este módulo permite que eu leia as variáveis de formulário postadas

// Other routes
const users   = require ("./routes/api/users");
const profile = require ("./routes/api/profile");
const auth    = require ("./routes/api/auth");
const posts   = require ("./routes/api/posts");

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/auth", auth);
app.use("/api/posts", posts);


app.listen(PORT, ()=>{console.log(`Node server running on port ${PORT}`)});