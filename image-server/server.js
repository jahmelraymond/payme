const express = require("express");
const app = express()
const upload = require("express-fileupload")
const fs = require("fs")
const cors = require('cors')
// const path = require('path')
app.use(upload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(cors())


app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html")
})
console.log(process.cwd())

app.get("/pull/:name", (req, res) => {
    let requested = process.cwd() + `/images/${req.params.name}`;
    if (fs.existsSync(requested)) {
        res.sendFile(requested)
    } else {
        res.send({ error: "No such file exists" })
        console.log(fs.existsSync(requested, (err) => console.log(err)))
    }


})

app.post("/upload/:id", (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log('req params', req.params)
    console.log('req files', req.files.myFile)

    let sampleFile = req.files.myFile;
    sampleFile.mv(process.cwd() + `/images/${req.params.id}-${sampleFile.name}`, (err) => { // store the file in the ./image/filenamehere
        if (err) {
            return res.status(400).send(err)
        }
        res.status(200).send({ result: "File Uploaded", link: `http://localhost:8000/pull/${req.params.id}-${sampleFile.name}`, id: req.params.id, name: sampleFile.name }) // if here, we got the imagei nthe server
    })
    // let image = req.files.image
    // image.mv(path.resolve(process.cwd() + `/images`, image.name), async (err) => {
    //     if (err)
    //         console.log(err)
    // })

})


app.listen(8000, () => {
    console.log("runnning")
})