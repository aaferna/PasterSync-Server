const express = require('express');
const fs = require('fs');
const unzipper = require('unzipper');
const fileUpload = require('express-fileupload');
const app = express();
const conf = require('./config.json');

let finaldir = conf.troncal
let tmp = conf.temporal

app.use(fileUpload({ useTempFiles : true, tempFileDir: tmp }));
app.set('json spaces', 2);

app.post('/upload', function(req, res) {

    const hoy = new Date();
    const time = hoy.getFullYear()+'/'+hoy.getMonth()+'/'+hoy.getDay()+'/';

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ status : "No hay Archivo" });
    }

    try {

        let FilPosted = req.files;
        FilPosted.data.mv(tmp+FilPosted.data.name, function(req, res) {

            let arrDirs = FilPosted.data.name.replace('.zip', '').split('_').toString().replace(',', "//")

            if(!arrDirs) { return res.status(400).json({ status : "No Archivo" }); }
            else {

                fs.createReadStream(tmp+FilPosted.data.name)
                .pipe(
                    unzipper.Extract(
                        { 
                            path: finaldir+time+arrDirs 
                        }
                    )
                );

                fs.unlinkSync(tmp+FilPosted.data.name)

            }
        
        })
        
        res.json({ status : "OK" });

    } catch (error) {
        console.log(error)
        res.json({ status : "FAIL", msj: JSON.stringify(error) });
    }
 
});

app.listen("3000", () => {
    console.log(`Sirviendo http://localhost:3000`)
})