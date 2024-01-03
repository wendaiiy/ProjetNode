// Ici on créer son serveur http manuellement 
var http = require('http');

var server = http.createServer(function (req, res) {
 if(req.url == '/'){// si la demande dl'utilisateur est appeler sur la page index
    res.writeHead(200, {'Content-Type': 'text/html'}); // il est obligatoire d'écrire le status et le type de donnée
    // A chaque fois que l'on veut envoyer une réponse il faut lui indiquer le type de donnée
    res.write('<html><body><p>This is my new home page.</p></body></html>'); // res.write() permet d'ecrire du contenu 
    res.end();// toujours mettre ça à la fin pour indiquer que l'on a tout envoyer.
 } 
 else if (req.url == '/student'){ // Sinon si le client est sur la page student +
    res.writeHead(200, {'Content-Type': 'text/html'});

    res.write('<html><body><h1>This is my new student page.</h1></body></html>');
    res.end();
 }
 else if(req.url =='/data'){
    res.writeHead(200, {'Content-Type': 'application/json'}); // pour indiquer que c'est du json on doit indique 'application/json'
    res.write(JSON.stringify({message : 'Hello World!'})); 
    //write on doit absolument lui donner une chaine de caractères c'est pour ça qu'on utilise Json.stringyfy()
    res.end();
 }
 else{
    res.end('Invalid request!');
 }

});
server.listen(5000); // le port 5000 est réserver pour le Node.js 4000 et 3000sont réservé pour les clients
console.log("server listening on port 5000");

