const {body} = require("express-validator") // importando o body que vem do express-validator, ele basicamente retorna todo o corpo da requisição.
// Quando se utilia o express-validator precisa-se invocar a função onde ela está sendo importada.
const userCreateValidation = () => { // Para validar a criação do usuário e pode ser retornado alguns erros baseados no body.
    return [ // Se o nome do usuário é ou não uma string, envia-se uma mensagem.
        body("name")
            .isString()
            .withMessage("O nome é obrigatório.")
            .isLength({min: 3})
            .withMessage("O nome precisa ter no mínimo 3 caracteres"),
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório")
            .isEmail()
            .withMessage("Insira um e-mail válido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
            .isLength({min: 5})
            .withMessage("A senha precisa ter no mínimo 5 caracteres"),
        body("confirmPassword")
            .isString()
            .withMessage("A confirmação de senha é obrigatória.")
            .custom((value, {req}) => { // validação de comparação de senha
                if(value != req.body.password) {
                    throw new Error("As senhas não são iguais");
                }
                return true; // caso atinja o resultado esperado.
            }),
    ];
};

const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório.")
            .isEmail()
            .withMessage("Insira um e-mail válido."),
        body("password").isString().withMessage("A senha é obrigatória."),
    ];
};

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({min: 3})
            .withMessage("O nome precisa de pelo menos 3 caracteres."),
        body("password")
            .optional()
            .isLength({min: 5})
            .withMessage("A senha precisa ter no mínimo 5 caracteres"),
    ]
}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
};