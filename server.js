const express = require('express');
const app = express();

const config = require("./config.json");
const PORT = process.env.PORT || config.PORT;

app.set("view engine", "ejs");
app.set("views", __dirname + "/public/views/");

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.render('index');
    res.render("customers", {
      customers: []
    });
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))