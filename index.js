const express = require('express');
const fs = require('fs');
const unzipper = require('unzipper');
const fileUpload = require('express-fileupload');
const app = express();


let tempFileDir = './tmp/'
let finaldir = './pre/'

// default options
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir: tempFileDir
}));

app.set('json spaces', 2);


app.post('/upload', function(req, res) {

    const hoy = new Date();
    const time = hoy.getFullYear()+'/'+hoy.getMonth()+'/'+hoy.getDay()+'/';

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }


    try {

        let FilPosted = req.files;
        FilPosted.data.mv(finaldir+FilPosted.data.name, function(req, res) {

            let arrDirs = FilPosted.data.name.replace('.zip', '').split('_').toString().replace(',', "//")

             fs.createReadStream(finaldir+FilPosted.data.name)
             .pipe(
                 unzipper.Extract(
                     { 
                         path: time+arrDirs 
                     }
                 )
             );
             fs.unlinkSync(finaldir+FilPosted.data.name)

        })
        
        res.json({ status : "OK" });

    } catch (error) {

        console.log(error)
        res.json({ status : "FAIL", msj: JSON.stringify(error) });
    }
 
});



app.listen("3000", () => {
    console.log(`Example app listening at http://localhost:3000`)
})