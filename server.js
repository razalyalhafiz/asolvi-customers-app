const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", __dirname + "/public/views/")

app.use(express.static(__dirname + "/public"))

app.get("/", function(req, res) {
  res.render("index", {
    customers: []
  })
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
