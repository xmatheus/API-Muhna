// inicia as rotas
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors"); // permitir acesso de determinado dominio

const all_routes = require("express-list-endpoints"); //testes

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

require("./controllers/authController")(app);
require("./controllers/userController")(app);
require("./controllers/newsController")(app);
require("./controllers/fileNewsController")(app);
require("./controllers/filePostController")(app);
require("./controllers/onePagController")(app);
require("./controllers/postController")(app);

const porta = process.env.PORT || 3000;
console.log("[D]Porta: " + porta);
app.listen(porta);

console.log("All routes:");
console.log(all_routes(app));

// function print(path, layer) {
//   if (layer.route) {
//     layer.route.stack.forEach(
//       print.bind(null, path.concat(split(layer.route.path)))
//     );
//   } else if (layer.name === "router" && layer.handle.stack) {
//     layer.handle.stack.forEach(
//       print.bind(null, path.concat(split(layer.regexp)))
//     );
//   } else if (layer.method) {
//     console.log(
//       "%s /%s",
//       layer.method.toUpperCase(),
//       path
//         .concat(split(layer.regexp))
//         .filter(Boolean)
//         .join("/")
//     );
//   }
// }

// function split(thing) {
//   if (typeof thing === "string") {
//     return thing.split("/");
//   } else if (thing.fast_slash) {
//     return "";
//   } else {
//     var match = thing
//       .toString()
//       .replace("\\/?", "")
//       .replace("(?=\\/|$)", "$")
//       .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
//     return match
//       ? match[1].replace(/\\(.)/g, "$1").split("/")
//       : "<complex:" + thing.toString() + ">";
//   }
// }

// app._router.stack.forEach(print.bind(null, []));
