const multer = require("multer") // para upload de arquivos
const path = require("path")    // módulo padrão do Node.js

// Destination to store image
const imageStorage = multer.diskStorage({ // Uma função que leva propriedades "destination" que recebe requisição, arquivos e a possibilidade de ter uma callback.
    destination: (req,file,cb) =>  {
        let folder = "";

        if(req.baseUrl.includes("users")) { // se caso a imagem vier de uma url que trata de usuários.
            folder = "users"
        }else if(req.baseUrl.includes("photos")) {
            folder = "photos"
        }
        cb(null, `uploads/${folder}/`) // A pasta para salvar os uploads.
    },
    filename: (req, file, cb) => { // Para mudar o nome do arquivo padrão.
        cb(null, Date.now() + path.extname(file.originalname)) // Pegar a string que é gerada em milissegundos da data + para pegar o formato da imagem. 
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)){  // checa se no fim do arquivo se tem uma extensão de jpg, png e etc.
            // upload only png and jpg formats
            return cb(new Error("Por favor, envie apenas png ou jpg!"))
        }
        cb(undefined, true)
    }
})

module.exports = {imageUpload};
