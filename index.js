const express = require('express');
const cors = require('cors');
const fs = require('fs');
const AdmZip = require('adm-zip');
const fileUpload = require('express-fileupload');
const app = express();
const conf = require('./config.json');

let troncal = conf.troncal
let tmp = conf.temporal

app.use(fileUpload({ useTempFiles : true, tempFileDir: tmp }));
app.set('json spaces', 2);
    	app.set(cors({
        origin: '*'
    }));


app.post('/upload', function(req, res) {

    const hoy = new Date();
    const time = hoy.getFullYear()+'/'+hoy.getMonth()+'/'+hoy.getDay()+'/';

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ status : "No hay Archivo" });
    }
    try {

        let FilPosted = req.files;
            FilPosted.data.mv(tmp+FilPosted.data.name, function(req, res) {

            let testFile = FilPosted.data.name.split('.zip')

            if(testFile.length == 2){ 
                console.log("Es zip")
                let arrDirs = FilPosted.data.name.replace('.zip', '')
                let preform = arrDirs.split('_')
                let finaldir = ""
                preform.map(el=>{
                    finaldir = finaldir + el + "/"
                })
                console.log(finaldir)
               
                if(!arrDirs) { return res.status(400).json({ status : "No Archivo" }); }
                else {
                    console.log('aca',tmp+FilPosted.data.name, troncal+time+finaldir )
                   
                    try{
                        let file = tmp+FilPosted.data.name
                        let destino = troncal+time+finaldir
                        var zip = new AdmZip(file);
                       // zipEntries = zip.getEntries();
                        zip.extractAllTo(destino, /*overwrite*/true);
    
                    } catch(err){
                        console.log(err)
                    }

                    // fs.createReadStream(tmp+FilPosted.data.name)
                    // .pipe(
                    //     unzipper.Extract(
                    //         { 
                    //             path: troncal+time+finaldir 
                    //         }
                    //     )
                    // );
                 //    fs.unlinkSync(tmp+FilPosted.data.name)
                }

            } else { console.log("No es un archivo ZIP") }

           
        
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