const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({ // Para instanciar a classe. O primeiro argumento é um objeto com o nome de todos os campos da collection.
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
}, {
    timestamps: true // para registrar a data de alteração dos dados. E o segundo argumento é um objeto que faz referência as configurações do model.
});

const User = mongoose.model("User", userSchema) // primeiro argumento é a definição do model, e o segundo argumento é o Schema do model.

module.exports = User;