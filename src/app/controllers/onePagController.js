const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	res.status(200).json({
		Descricao: "Api do Museu de História Natural do Araguaia",
		Contato: "matheuscorreia559@gmail.com"
	});
});

module.exports = app => app.use("/", router);
