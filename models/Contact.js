const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    nom : {type : 'string'},
    prenom : {type :'string'},
    email : {type :'string'},
    message : {type : 'string'}
});

module.exports = mongoose.model('Contact', contactSchema); // cela veut dire que le fichier Contact on va l'expoter et qu'il soit utilisable dans le controller et mongoDB 
// On indique que l'on doit exporter le modèle mongoose avec le nom similaire au fichier puis on récupre la var contactSchema qui sera le paramétrage 