// Import des librairie 

// Ici on utilise le framwork 'express' au lieu de créer le server.js
var express = require('express'); // lorsqu'on a une dépendance on doit l'appeler avec un 'require'et toujours en haut  
var app = express(); 

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false})); //ici le extend sert à creer un url encodé très long pour plus de securité; ici on le met a false pour ne pas qu'il soit trop long.

// var path = require('path');
require('dotenv').config(); // Pas besoin de faire un var parce que le env est une librairie liée a un fichier et comme c'est un fichier de configuration on met directement le require

var cors = require('cors');
app.use(cors({credentials:true, origin: 'http://localhost:3000'}));

const url = process.env.DATABASE_URL;

var mongoose = require('mongoose'); // on l'appel toujours avec le require

mongoose.connect(url, { // userNewUrlParser et useUnifiedTopoly sert a sécuriser les accès du servers vers la mongodb. 
    // useNewUrlParser: true, //n'est plus obligatoire avec la nouvelle version il est automtiquement en place
    // useUnifiedTopology: true // n'est plus obligatoire avec la nouvelle version il est automtiquement en place
    }).then(console.log("Mongodb connected")) // ici le then est 
    .catch(err => console.log(err)); 

app.set('view engine', 'ejs');//Donne le chemin des fichiers ejs dans le dossier views

// pour incorporer des fichiers CSS attention c'est un langage serveur dans ejs mais il faut éviter de faire du CSS
//si on veut mettre le dossier public dans le dossier views il faut faire : app.use(express.sta)
app.use(express.static('public'));

const methodOverride = require('method-override');
app.use(methodOverride("_method"));

const bcrypt = require('bcrypt');

// Permet de stocker le token à l'intérieur du cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//upload d'un fichier : multer

const multer = require('multer');
app.use(express.static('upload'));

// Import des fonction créer dans le JWT.js

const {createTokens, validateToken} = require('./JWT');

const {jwtDecode} = require('jwt-decode');

//models

var Contact = require('./models/Contact');

app.get('/', function (req, res) { // Ici en rajouta,t la fonction validateToken cela indique que le user n'est pas valide si on le met sur un navigateur privée. On l'écrit comme ceci app.get('/', validateToken, function (req, res) 

    // res.send('<h1>hello world !</h1>');
    Contact.find().then( data => { // ici le data est en d minuscule car on veut récupére la donné 
        console.log(data);
        // res.render('Home', {data : data});
        res.json(data);
    }).catch(err => console.log(err));
    // res.sendFile(path.resolve('index.html')); // on le remplace par la res.render()
    // res.render('Home');
})

app.get('/formulaire', function (req, res) {
    res.render('Formulaire');
});

app.get('/formulaire/:id', function (req, res) { // lorsqu'on tape dans la barre on remplace le /:id par le numero directement
    Contact.findOne({// ici on met _id parce que l'idée généré par mongodb et commance par _id
        _id : req.params.id // les params sont les élements qui sont dans l'url 
    }).then(data => {
        // res.render('Edit', {data : data});
        res.json(data); // il est plus simple de mettre data au lieux de data:data car les données sont en direct; moins galère à récupérer les données.  
    }).catch(err => console.log(err));
   
});

app.post('/submit-contact-data', function (req, res) {        
    const Data = new Contact({ //Data avec le D majuscule est pour stocker une donnée data en d minuscule c'est pour récuper un donée
        nom : req.body.nom,
        prenom : req.body.prenom,
        email : req.body.email,
        message : req.body.message
    }); 
    Data.save()
    .then(() =>{ // ici on met une fonction flécher et non pas anonyme parce que anonyme n'est pas pris en compte dans .then()
        console.log("Data saved !");
        res.redirect("http://localhost:3000/contact"); // on le redirige vers l'index 
    })
    .catch(err => console.log(err));
    // A chaque requete avec mongo on va ecrire une prommesse un .then() et .catch() pour vérfier que la requête a bien été effectuée 
})

// put() ici sert à faire la mise à jour ici de notre formulaire 
app.put('/edit/:id', function(req, res){
    const Data  = {
        nom : req.body.nom,
        prenom : req.body.prenom,
        email : req.body.email,
        message : req.body.message
    }

    Contact.updateOne({_id : req.params.id}, {$set: Data}).
    then(data =>{
        console.log("Donné mise à jour");
        console.log(data);
        res.redirect("http://localhost:3000/contact/");
    })        
    .catch(err => console.log(err));
});

// Suppression d'un contact avec l'id 
app.delete('/delete/:id', function(req, res){
    Contact.findOneAndDelete({_id : req.params.id})
    .then( data =>{
        console.log("Donné supprimée :");
        res.redirect("http://localhost:3000/contact");
    })
    .catch(err => console.log(err));
});

app.post('/submit-student-data' , function (req, res) {
    console.log(req.body.firstName);
    // console.log(req.body.First);
    var name = req.body.firstName + ' ' + req.body.lastName;
    res.send("Merci d'avoir rempli le formulaire" + name);   
});


// A chaque requetes envoyer il faut toujours envoyer une response res.end()


// ********************** Exercice  ***********************//
// app.post('/submit-contact-data', function (req, res) {
//     var info = req.body.nom + " " + req.body.prenom;
//     var email = req.body.email;
//     res.send("Bonjour " + info + "<br> Merci de nous avoir contacter" + "<br> Nous reviendrons vers vous dans les plus bref délais a cette adresse mail : " + email);
// })

// ou autre solution plus simple 
// app.post('/submit-contact-data', function (req, res) {
//     var message = "Bonjour " + info + "<br> Merci de nous avoir contacter" + "<br> Nous reviendrons vers vous dans les plus bref délais a cette adresse mail : " + email
//    res.send(message);
// })


var Post = require('./models/Post');

app.get('/HomePost', function (req, res) {
    Post.find()
    .then( data => { 
        // console.log(data);
        // res.render('HomePost', {data : data});
        res.json(data);
    }).catch(err => console.log(err));
  
 
});

app.get('/formpost', function (req, res) {
    res.render('Formpost');
});

app.get('/formpost/:id', function (req, res){
    Post.findOne({_id : req.params.id}).then(data => {
        res.render('Editpost', {data : data});
    }).catch(err => console.log(err));
})

app.post('/submit-post-data', function (req, res) {        
    const Data = new Post({
        titre : req.body.titre,
        auteur : req.body.auteur,
        contenu : req.body.contenu,
    }); 
    Data.save()
    .then(() =>{ 
        console.log("Post enregister!");
        res.redirect("/HomePost"); 
    })
    .catch(err => console.log(err));
})

app.put('/edit-post/:id', function(req, res){
    const Data = {
        titre : req.body.titre,
        auteur : req.body.auteur,
        contenu : req.body.contenu
    }
    Post.updateOne({_id: req.params.id}, {$set:(Data)})
    .then(data =>{
       console.log("Post mis à jour");
        res.redirect("/HomePost");
    })
    .catch(err => console.log(err));
})

app.delete('/delete-post/:id', function(req, res){
    Post.findOneAndDelete({_id: req.params.id})
   .then( data =>{
    console.log("Post supprimé");
    res.redirect("/HomePost");
   })
   .catch(err => console.log(err));
})

// ********************** CRUD USER  ***********************//
var User = require('./models/User');


app.post('/api/register', function (req, res) {
    console.log(Object.keys(req.body.password).length); 
    const Data = new User({
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10),
        admin: req.body.admin
    })
    Data.save()
    .then(() =>{
        if(Object.keys(req.body.password).length < 12){
            return res.status(404).send("Mot de passe trop court"); // pas besoin de faire un else parce que avec le return il va automatiquement arreter le code 
        }          
        console.log("User enregister!");
        res.redirect("http://localhost:3000/login");        
       
    })
    .catch(err => console.log(err));
})

app.get('/formregister', function (req, res){
    res.render('Register');
})

app.get('/login', function (req, res) {
    res.render('Login');
});

app.post('/api/login', function (req, res) {
    User.findOne({username : req.body.username})
    .then(user=>{
        if(!user){
            return res.status(404).send("Pas d'utilisateur trouvé");
        }
        console.log(user);
        if(!bcrypt.compareSync(req.body.password, user.password))
        {
            return res.status(404).send("Mot de passe incorrect");
        }

        const accessToken = createTokens(user);
        res.cookie("accessToken", accessToken, {
            maxAge : 1000*60*60*24*30, // 30 jours en ms ici dans 30 jours à al'heure précise de la création du cookies et du 
            httpOnly : true
        })


        // res.render('profil', {data : user}); // ici on récupére les données de l'utilisateur pour qu'ils puissents'afficher sur le profil
        res.json("LOGDE IN");
    })
    .catch(err => console.log(err)); 
  
})

app.get('/logout' , (req, res) => {
    res.clearCookie("accessToken"); // ici on supprime le cookie a la déconnexion du client
    res.redirect('http://localhost:3000/');
});

// get jwt : mettre à disposition le JWT au client

app.get('/getJWT', (req, res) => {
    // res.json(req.cookies.accessToken)
    res.json(jwtDecode(req.cookies.accessToken)); // permet de récupérer les information de manièere lisible 
})

// ********************** UPLOAD IMAGE  ***********************//
var IMAGE = require('./models/Image');

app.get('/formulaireImage', (req, res) => {
    res.render('formulaireImage')
})

const storage = multer.diskStorage({
    destination : function(req, file, callback){
        callback(null,"./public/image")
    },
    filename : function(req, file, callback){
        callback(null, file.originalname)
    }
})

const upload = multer({storage})

app.post('/api/upload', upload.single('image'), (req, res) => {
  const Image = new Image({
    titre : req.body.titre,
    image : req.body.image
  })
  Data.save()
  .then(express.response=>{
    console.log(response.data)
  })
})



app.post('/api/register', function (req, res) {
    console.log(Object.keys(req.body.password).length); 
    const Data = new User({
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10),
        admin: req.body.admin
    })
    Data.save()
    .then(() =>{
        if(Object.keys(req.body.password).length < 12){
            return res.status(404).send("Mot de passe trop court"); // pas besoin de faire un else parce que avec le return il va automatiquement arreter le code 
        }          
        console.log("User enregister!");
        res.redirect("http://localhost:3000/login");        
       
    })
    .catch(err => console.log(err));
})



var server = app.listen(5000, function(){
    console.log("Node server is listening on port 5000");
}); 