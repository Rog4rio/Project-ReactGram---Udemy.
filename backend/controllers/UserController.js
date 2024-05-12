const User = require("../models/User");


const bcrypt = require("bcryptjs"); // importando
const jwt = require("jsonwebtoken"); // importando o jwtsecret com o pacote.

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET; // Pegar o secret jwt.

// Generate user token
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {expiresIn: "7d",}) // Gerando o token. 1º argumento é o id do usuário. 2º argumento é o jwtsecret. 3º argumento é a data de expiração, para fazer o logout automático depois desse tempo.
}

// Register user and sign in
const register = async(req,res) => {
    const {name, email, password} = req.body // pegar o nome, email e a senha que chegam da requisição.

    // check if user exists
    const user = await User.findOne({email}) // Esperar o model encontrar o usuário pelo e-mail. Para saber se o usuário quer cadastrar o mesmo e-mail que já tem no sistema
    if(user) {  // Quando tiver o e-mail cadastrado.
        res.status(422).json({errors: ["Por favor, utilize outro e-mail"]})
        return
    }

    // Generate password hash
    const salt = await bcrypt.genSalt() //Gerar a string aleatória
    const passwordHash = await bcrypt.hash(password, salt) // Devolve uma senha aleatória.

    // Create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash // para utilizar a minha senha gerada.
    })

    // If user was created sucessfully, return the token
    if(!newUser) { // Se não foi criado com sucesso.
        res.status(422).json({errors: ["Houve um erro, por favor tente mais tarde"]})
        return
    }

    res.status(201).json({ // 201 status para criação com sucesso.
        _id: newUser._id,
        token: generateToken(newUser._id), // Criar um token a partir do id do usuário.
    })
}

// Sign user in
const login = async (req, res) => {
    
    const {email, password} = req.body // recebemos o email e a password do corpo da requisição.

    const user = await User.findOne({email})

    //Check if user exists
    if(!user) {
        res.status(404).json({errors: ["Usuário não encontrado."]})
        return
    }

    // Check if password matches. Para checar se a senha que o usuário mandou combina com a senha do usuário.
    if(!(await bcrypt.compare(password, user.password))) { // Entrar no if se elas não forem iguais(falso). Vai ser true quando forem iguais.
        res.status(422).json({errors: ["Senha inválida"]})
        return
    }

    // Return user with token. Quando der tudo certo.
    res.status(201).json({ // 201 status para criação com sucesso.
        _id: user._id,
        profileImage: user.profileImage, // retornando a imagem do usuário, caso ele tenha.
        token: generateToken(user._id) // Criar um token a partir do id do usuário.
    })
}

// Get current logged in user
const getCurrentUser = async (req, res) => {
    const user = req.user

    res.status(200).json(user);
}

// Update an user
const update = async (req, res) => {
    
    const {name, password, bio} = req.body

    let profileImage = null;

    if(req.file) { // para checar se chegou algum documento.
        profileImage = req.file.filename
    }

    const reqUser = req.user // O usuário da requisição.
    

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password") // converter a string que chega da requisição para o tipo de object id.

    if(name) { // o nome do usuário já é esse novo nome da requisição..
        user.name = name;
    }

    if(password) { // se chegou a senha do usuário.
        const salt = await bcrypt.genSalt() //Gerar a string aleatória
        const passwordHash = await bcrypt.hash(password,salt) // Devolve uma senha aleatória.

        user.password = passwordHash;
    }

    if(profileImage) { // atualização da imagem.
        user.profileImage = profileImage;
    }

    if(bio) { // atualização da bio.
        user.bio = bio;
    }

    await user.save(); // para salvar as alterações.

    res.status(200).json(user);
}

// Get user by id
const getUserById = async (req, res) => {
    const {id} = req.params // resgatando o id da URL

    try{
        const user = await User.findById( new mongoose.Types.ObjectId(id)).select("-password")
    // Check if user exists
    if(!user) {
        res.status(404).json({errors: ["Usuário não encontrado."]})
        return 
     }
     res.status(200).json(user);
    }catch(error){
        res.status(404).json({errors: ["Usuário não encontrado."]})
        return 
    }


}

// Disponibilizando as funções através de um objeto.
module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
}