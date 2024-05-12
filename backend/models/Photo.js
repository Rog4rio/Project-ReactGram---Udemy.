const mongoose = require("mongoose")
const {Schema} = mongoose

const PhotoSchema = new Schema({
    image: String, // Caminho da imagem. No banco de dados não se salva a imagem, vamos salvar em forma de upload e no profileImage e no image salva-se o caminho até a imagem(path).
    title: String,  
    likes: Array,
    comments: Array,
    userId: mongoose.ObjectId, // um tipo especial que indica que é uma string de id de mongoose.
    userName: String,
}, {
    timestamps: true
})

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;