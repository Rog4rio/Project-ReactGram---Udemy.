require("dotenv").config(); // para dá acesso ao arquivo .env

const express = require("express") // back-end
const path = require("path") // do próprio node.js para utilizar para determinar onde vai ser o diretório das imagens.
const cors = require("cors") // Para poder acessar o projeto da própria aplicação de front-end.

const port = process.env.PORT; // para utilizar as coisas que tem no dotenv.

const app = express(); // Inicializando a aplicação. Invocando o framework pela variável.

// config JSON and form data response(para receber a resposta em forma de JSON e em form data para enviar as imagens.)
app.use(express.json())
app.use(express.urlencoded({extended: false})); // para aceitar form data. Para trabalhar com as requisições.

// Solve CORS
app.use(cors({credentials: true, origin: "http://localhost:3000"})); // Quando a gente executa requisições pelo mesmo domínio. Depende da onde fica o projeto front-end.

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

// DB connection
require("./config/db.js");

// routes
const router = require("./routes/Router.js") // Chamando o arquivo do router.

app.use(router); // Todas as rotas colocadas no arquivo, servirão como base para a aplicação.

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`) // ativando a aplicação.
});

