const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const routes = require("./routes");
const app = express();


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
});

const angularpath = path.join(__dirname, "..", "front/dist/focus-point/browser")
app.use("/", express.static(angularpath))

app.use(bodyParser.json())
app.use(express.json())

app.get("/app", (_, res) => res.redirect(`/app/incoming`))
app.use("/api", routes)

app.get("/*", (_, res) => 
  res.sendFile(path.join(angularpath, "index.html"))
);



const PORT = 4000;
app.listen(PORT, function () {
  console.log(`Server listening at http://localhost:${PORT}/login`)
})