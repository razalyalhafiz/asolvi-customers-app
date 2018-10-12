const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/public/views/");

app.use(express.static(__dirname + "/public"))

app.get('/', function (req, res) {
    res.render('index');
})

app.listen(port);