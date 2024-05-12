const User = require("../models/User")
const jwt = require("jsonwebtoken")
const jwtSecret = process.env.JWT_SECRET

const authGuard = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Verificando se o token de authHeader(authorization) existe, porque o authorization não tem token, e vai verificar se o token vem da requisição, e pegando a segunda parte do header.

    // check if header has a token. Verificando se o cabeçalho tem token.
    if(!token) return res.status(401).json({errors: ["Acesso negado."]})

    // check if token is valid
    try {
        const verified = jwt.verify(token, jwtSecret) // Comparar o token com o jwtSecret. Para ver se combina.
        req.user = await User.findById(verified.id).select("-password") // Para não trafegar um dado que não é necessário, pois o usuário não é autenticado.
        next()
    } catch (error) {
        res.status(401).json({errors: ["Token inválido."]})
    }
}

module.exports = authGuard