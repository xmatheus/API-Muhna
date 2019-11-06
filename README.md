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

 - Foi usado como base os cursos stater da [Rocketseat](https://rocketseat.com.br/), e também alguns vídeos de Reactjs que estão no [Canal Rocketseat](https://www.youtube.com/channel/UCSfwM5u0Kce6Cce8_S72olg).
 
 ### Estruturação de pastas



![treefilesNodeText2](https://user-images.githubusercontent.com/34286800/68332965-0ff14100-00ae-11ea-8c09-c6b20ddaf243.png)


### Rotas da API

![rotasAPI](https://user-images.githubusercontent.com/34286800/68334926-e4705580-00b1-11ea-8ff0-596dd4fd93dc.png)


### [Insomnia](https://insomnia.rest/download/)

Para visualizar todas as rotas da API e entender melhor: Faça o download do [Insomnia](https://insomnia.rest/download/) e importe esse [backup](https://github.com/xmatheus/API-Muhna/blob/master/Insomnia_2019-11-06-APIMUHNA.json)

[Demonstrativo no heroku](http://muhna-api.herokuapp.com/)




    



