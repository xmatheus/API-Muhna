
## Projeto Digital do Museu de História Natural do Araguaia
### Universidade Federal Do Mato Grosso

<p> <b>Orientador:</b> Ivairton Monteiro Santos </p>

<p><i>ivairton@ufmt.br</i></p>

<p> <b>Orientando:</b> Matheus Felipe T. Correia </p>

<p><i>matheuscorreia559@gmail.com</i></p>

<p style='text-align: justify;'> O Museu de História Natural do Araguaia (MuHNA) está localizado no Campus Universitário do Araguaia/UFMT, em Barra do Garças/MT. O seu acervo é constituído por coleções de zoologia, paleontologia e geologia, contendo também espécies da região. O MuHNA possui entrada gratuita e está aberto às terças, quintas e sextas feiras, das 08:30h às 11:30h e das 13:30 h às 17:00 h. No ano de 2018 recebeu a visita de mais de 3.600 pessoas de vários lugares do mundo, 3 países, 16 estados e 82 cidades.
O MuHNA possui diversas atrações: Diorama(um modo de exposição artística tridimensional); Cinema 3D; Sala dos sentidos: nela você irá utilizar seus sentidos para conhecer, tocar e sentir o que a ciência, em conjunto com a natureza, pode oferecer; 
Animais 3D: Dentro do museu a alguns totens que possuem modelos tridimensionais de animais, sendo possível ver sua estrutura óssea e hábitos; Aplicativo android: o MuHNA possui dois tablets à disposição do público, nesses tablets é possível jogar o jogo da memória que utiliza de figuras de animais típicos do acervo do museu, e também o quiz que possui diversas perguntas sobre os animais.</p>


### O que é isso aqui?

A sigla API corresponde às palavras em inglês “Application Programming Interface“. No português “Interface de Programação de Aplicações”. Elas são uma forma de integrar sistemas, possibilitando benefícios como a segurança dos dados, facilidade no intercâmbio entre informações com diferentes linguagens de programação.
[Fonte](https://vertigo.com.br/o-que-e-api-entenda-de-uma-maneira-simples/)

Essa API foi desenvolvida para facilitar o compartilhamento de informações entre as aplicações do [MuHNA](http://araguaia2.ufmt.br/muhna/).


### É necessário ter instalado

* [Nodejs](https://nodejs.org/pt-br/download/package-manager/)
* [Yarn](https://yarnpkg.com/pt-BR/docs/install#debian-stable)
* [Mongodb](https://docs.mongodb.com/manual/installation/)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### .env

É necessário criar um arquivo .env na raiz do projeto com as seguintes váriaveis:

| váriavel | valor | Descrição |
| ------ | ------ | ----------|
| MONGO_URL | {url} | URL do banco de dados |
| secret | {md5 criado por você} | md5 ou não para encriptar as senhas |
| name | Muhna | usuário padrão da API |
| email | muhna@muhna.com | email do usuário padrão |
| password | *********** | senha do usuário padrão |
| Ohost | {servidor smtp} | servidor smtp para envio dos tokens para troca de senha |
| port | 2525(exemplo)  | porta do servidor smtp |
| user | teste | usuário do servidor SMTP |
| pass | *********** | senha do usuário do servidor SMTP |


### Instalação


```sh
$ sudo apt update
$ git clone https://github.com/xmatheus/API-Muhna
$ cd API-Muhna
$ yarn install
Em desenvolvimento
$ yarn dev (inicia o nodemon e permite um 'fast refresh')
Deixar rodando
$ yarn start

```




### Início rápido

 - Foi usado como base os cursos stater da [Rocketseat](https://rocketseat.com.br/), e também alguns vídeos de Nodejs que estão no [Canal Rocketseat](https://www.youtube.com/channel/UCSfwM5u0Kce6Cce8_S72olg).
 
 ### Estruturação de pastas



![treefilesNodeText2](https://user-images.githubusercontent.com/34286800/68332965-0ff14100-00ae-11ea-8c09-c6b20ddaf243.png)


### Rotas da API


| Caminho | métodos | Body | Query |Descrição | precisa estar autenticado | resposta |Precisa ser admin |
| -- | -- | -- | -- | --| -- | -- | -- |
| */* | GET || | informações sobre a API| não | JSON contendo uma descrição e contato  | não |
| */auth/default* | GET |  | | cria um usuário padrão na API, suas informações dependem do arquivo .env | não | | não|
| */auth/register* | POST | email | | cria usuário| sim | código 200 e informações do usuário |  não|
| */auth/authenticate* | POST | email, password | | autentica o usuário| sim| informações do usuário e o token | não|
| */auth/verify* | POST | | | verifica o token| sim | código 200 ou 401 | não|
| */auth/forgot_password* | POST | email | | cria o token de reset de senha e delimita um tempo de expiração| não | código 200 ou 400, e um email contendo o token de troca de senha | não|
| */auth/reset_password* | POST | email, token, password | | troca a senha do usuário| não | código 200 ou 400 | não|
| */auth* | POST | | | retorna todos os usuários| sim | JSON com todos os usuários | sim |
| */auth* | DELETE | | userId | delete um usuário| sim | código 401 ou 400 ou 200 | sim |
| */auth/search* | POST | name|  | busca os usuários com base no nome| sim | json contendo os usuários que tem aquele nome buscado e código 200, ou código 404 | sim |
| */news/create* | POST | title, resume, news|  |cria uma notícia| sim | json contendo as informações da notícia e o autor  | não |
| */news/update* | PUT | title, resume, news|  |atualiza as informações de uma notícia| sim | código 200 ou 400  | não |
| */news* | GET || newsid |retorna a notícia correspondente ao id| não | código 200 e a notícia, ou código 400  | não |
| */news/show* | GET || page(página a ser buscada, padrão é 1), limite(quantidade de notícias por página, padrão é 10) |retorna todas as notícias| não | código 200 e as notícias, ou código 400  | não |
| */news/remove* | POST(irei atualizar para DELETE) || newsid |remove uma notícia| sim | código 200 ou código 400  | não |
| */news/search* | POST || title |busca as notícias com base no título| não | código 200 e  um JSON com as notícias, ou código 404  | não |
| */fileNews* | POST ||newsid |envia um arquivo para a notícia(limite de 100mb, é permitido apenas imagens e videos)| sim | código 200 e  um JSON com as informações do arquivo, ou código 400  | não |
| */fileNews* | GET || |retorna informações sobre todos os arquivos, mas não contém os ids das notícias e os links do YT| sim | código 200 e  um JSON com as informações dos arquivo, ou código 400  | não |
| */fileNews* | DELETE || idfile(remove um arquivo) ou id(remove um link)|deleta um arquivo ou um link do Yt| sim | código 200, ou código 400  | não |
| */fileNews/all* | GET || |retorna informações sobre todos os arquivos de notícias e os links do YT| sim | código 200 e  um JSON com as informações dos arquivo, ou código 400  | não |
| */fileNews/image* | GET || filename|busca uma imagem| não | retorna a imagem, ou código 404  | não |
| */fileNews/video* | GET || filename|busca um video| não | retorna um video, ou código 404 ou 400  | não |
| */fileNews/news* | GET || newsid|busca todos os arquivos de uma notícia| não | retorna um json contendos as informações dos arquivos , ou código 404 ou 400  | não |
| */fileNews/link* | POST || newsid|envia um link do YT para a notícia| sim | retorna um json contendos as informações do link, ou código 400  | não |
| */post/create* | POST | title, post|  |cria uma postagem| sim | json contendo as informações da postagem e o autor  | não |
| */post/update* | PUT | title, post|  |atualiza as informações de uma postagem| sim | código 200 ou 400  | não |
| */post* | GET || postid |retorna a postagem correspondente ao id| não | código 200 e a notícia, ou código 400  | não |
| */post/show* | GET || page(página a ser buscada, padrão é 1), limite(quantidade de postagens por página, padrão é 10) |retorna todas as postagens| não | código 200 e aspostagens, ou código 400  | não |
| */post/remove* | POST(irei atualizar para DELETE) || postid |remove uma postagem| sim | código 200 ou código 400  | não |
| */post/search* | POST || title |busca as postagens com base no título| não | código 200 e  um JSON com as postagens, ou código 404  | não |
| */filePost* | POST ||postid |envia um arquivo para a postagem(limite de 100mb, é permitido apenas imagens e videos)| sim | código 200 e  um JSON com as informações do arquivo, ou código 400  | não |
| */filePost* | GET || |retorna informações sobre todos os arquivos, mas não contém os ids das postagens e os links do YT| sim | código 200 e  um JSON com as informações dos arquivo, ou código 400  | não |
| */filePost* | DELETE || idfile(remove um arquivo) ou id(remove um link)|deleta um arquivo ou um link do Yt| sim | código 200, ou código 400  | não |
| */filePost/all* | GET || |retorna informações sobre todos os arquivos de postagens e os links do YT| sim | código 200 e  um JSON com as informações dos arquivo, ou código 400  | não |
| */filePost/image* | GET || filename|busca uma imagem| não | retorna a imagem, ou código 404  | não |
| */filePost/video* | GET || filename|busca um video| não | retorna um video, ou código 404 ou 400  | não |
| */filePost/post* | GET || postid|busca todos os arquivos de uma postagem| não | retorna um json contendos as informações dos arquivos , ou código 404 ou 400  | não |
| */filePost/link* | POST || postid|envia um link do YT para a postagem| sim | retorna um json contendos as informações do link, ou código 400  | não |
| */galery* | POST || |envia um arquivo para a galeria| sim | retorna um json contendos as informações do arquivo, ou código 400  | não |
| */galery* | GET || page(página a ser buscada, padrão é 1), limite(quantidade de postagens por página, padrão é 10)|mostra os arquivos da galeria| sim | retorna um json contendos as informações dos arquivos | não |
| */galery* | DELETE || idfile|remove um arquivo| sim | código 200 ou 400 | não |
| */galery/image* | GET || idfile|mostra uma imagem| sim | imagem e código 200, ou 400 | não |





## imagem do console da API 
![rotasAPI](https://user-images.githubusercontent.com/34286800/68334926-e4705580-00b1-11ea-8ff0-596dd4fd93dc.png)


### [Insomnia](https://insomnia.rest/download/)

Para visualizar todas as rotas da API e entender melhor: Faça o download do [Insomnia](https://insomnia.rest/download/) e importe esse [backup](https://github.com/xmatheus/API-Muhna/blob/master/Insomnia_2019-11-06-APIMUHNA.json)

[Demonstrativo no heroku](http://muhna-api.herokuapp.com/)




    



