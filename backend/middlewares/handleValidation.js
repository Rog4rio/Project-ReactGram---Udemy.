const {validationResult} = require("express-validator")

const validate = (req, res, next) => { // recebe a requisição, a resposta e o next quando queremos prosseguir ou não em algum fato na requisição.

    const errors = validationResult(req); // Erros que virão da requisição. Toda requisição que tiver um middleware de validação, ela irá retornar possíveis erros.

    if(errors.isEmpty()){
        return next() // Quando não tem erro, prosseguir.
    }

    const extractedErrors = []; // Se não está vázio, ele tem erro. Erros extraídos da requisição.

    errors.array().map((err) => extractedErrors.push(err.msg)) // Colocar a mensagem de cada erro no extractedErrors.

    return res.status(422).json({ // o status 422 é utilizado para comunicar que a requisição não foi bem sucedida.
        errors: extractedErrors // para consumir no front-end e mostrar para o usuário qual erro que ocorreu.
    })

}

module.exports = validate;