const Photo = require("../models/Photo");
const User = require("../models/User");
const mongoose = require("mongoose");

// Insert a photo, with an user related to it
const insertPhoto = async (req,res) => {

    const {title} = req.body
    const image = req.file.filename

    const reqUser = req.user

    const user = await User.findById(reqUser._id);

    // Create a phot
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // if photo was created successfully, return data
    if(!newPhoto){
        res.status(422).json({
            errors: ["Houve um problema, por favor tente novamente mais tarde."]
        });
        return;
    }

    res.status(201).json(newPhoto)
};

// Remove a photo from DB
const deletePhoto = async (req, res) => {

    const {id} = req.params

    const reqUser = req.user

    try{
        const photo = await Photo.findById( new mongoose.Types.ObjectId(id))
      
        //Check if photo exists
        if(!photo) {
            res.status(404).json({errors: ["Foto não encontrada"]})
            return;
        }
    
        // Check if photo belongs to user
        if(!photo.userId.equals(reqUser._id)){
            res.status(422).json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]})
        }
    
    
        // Se a foto for do usuário.
        await Photo.findByIdAndDelete(photo._id)
    
        res.status(200).json({id: photo._id, message: "Foto excluída com sucesso."});  
    }catch(error) {
        res.status(404).json({errors: ["Foto não encontrada"]})
        return;
    }

};

// Get all photos
const getAllPhotos = async (req, res) => {
    
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec() // Com o find tem como criar um objeto que filtra e com o valor vazio {}, significa que se quer buscar todos os objetos. O metodo "sort" ordena os itens, e passando os valores [createdAt, -1] significa que esta sendo ordenado pelos itens mais novos. 

    return res.status(200).json(photos);

}

// Get user photos
const getUserPhotos = async(req, res) => {
    
    const {id} = req.params // para pegar o id da URL e não da requisição.

    const photos = await Photo.find({userId: id}).sort([["createdAt", -1]]).exec() // O id do usuário está como userId.
    console.log(photos, 'ccccccccccccccccccc')
    return res.status(200).json(photos);

}

// Get photo by id
const getPhotoById = async (req, res) => {
    
    const {id} = req.params

    const photo = await Photo.findById( new mongoose.Types.ObjectId(id)) // para tentar achar a foto pelo id que foi recebido pela URL.
    console.log(photo, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    // Check if photo exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada"]});
        return;
    }

    res.status(200).json(photo);

}

// Update a photo
const updatePhoto = async (req, res) => {

    const {id} = req.params
    const {title} = req.body // para atualizar somente o titulo, é uma regra de negócio.

    const reqUser = req.user 

    const photo = await Photo.findById(id)

    // Check if photo exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada"]})
        return
    }

    //Check if photo belongs to user
    if(!photo.userId.equals(reqUser._id)){ // Se o id da foto não for igual ao id do usuário.
        res.status(422).json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]});
        return;
    }


    if(title) {
        photo.title = title // se o título veio, o titulo da foto vai ser igual o título
    }

    await photo.save()

    res.status(200).json({photo, message: "Foto atualizada com sucesso!"});

};

// Like functionality
const likePhoto = async (req, res) => {

    const {id} = req.params

    const reqUser = req.user

    const photo = await Photo.findById(id)

    
    // Check if photo exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada"]})
        return
    }

    // Check if user already liked the photo
    if(photo.likes.includes(reqUser._id)){
        res.status(422).json({errors: ["Você já curtiu a foto."]})
        return;
    }

    // Put user id in likes array
    photo.likes.push(reqUser._id)

    await photo.save()

    res.status(200).json({photoId: id, userId: reqUser._id, message: "A foto foi curtida" });

}

//Comment functionality
const commentPhoto = async (req, res) => {

    const {id} = req.params
    const {comment} = req.body

    const reqUser = req.user

    const user = await User.findById(reqUser._id)

    const photo = await Photo.findById(id);

    // Check if photo exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada"]})
        return;
    }

    //Put comment in the array of comments
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    };
    photo.comments.push(userComment) // Adicionando o comentário do usuário no array de comentários.

    await photo.save()

    res.status(200).json({
        comment: userComment,
        message: "O comentário foi adicionado com sucesso",
    });
};

// Search photos by title
const searchPhotos = async (req, res) => {
    
    const {q} = req.query // Esperando um argumento q da query string da URL.

    const photos = await Photo.find({title: new RegExp(q, "i")}).exec() // Para procurar o que estou procurando em qualquer posição da string.

    res.status(200).json(photos);

}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
}