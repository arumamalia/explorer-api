const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const cors = require("cors");
const port = 8080

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/folders', db.getFolders);
app.post('/folders', db.addFolder);
app.get('/folders/:id', db.detailFolder);
app.put('/folders/:id', db.renameFolder);
app.post('/route', db.addressBar);


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})