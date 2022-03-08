console.log('starting')

const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const multer = require('multer')
const path = require('path')


var root = path.dirname(require.main.filename)
const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname)
    },
});

const upload = multer({storage: fileStorageEngine});

app.use(cors());

app.post('/upload', upload.single('video'), (req, res) => {
    console.log(req.file)
    var absolutePath = path.join(root, req.file.path)
    res.json({fileName: req.file.filename, filePath: absolutePath})
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost: ${port}`)
});