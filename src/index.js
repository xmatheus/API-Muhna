// inicia as rotas
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors'); // permitir acesso de determinado dominio

const all_routes = require('express-list-endpoints'); // testes

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

require('./controllers/authController')(app);
require('./controllers/userController')(app);
require('./controllers/newsController')(app);
require('./controllers/fileNewsController')(app);
require('./controllers/filePostController')(app);
require('./controllers/onePagController')(app);
require('./controllers/postController')(app);
require('./controllers/galeryController')(app);

const porta = process.env.PORT || 3001;
console.log(`[D]Porta: ${porta}`);
app.listen(porta);

console.log('All routes:');
console.log(all_routes(app));
