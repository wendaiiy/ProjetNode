const {sign , verify} = require('jsonwebtoken');

const createTokens = (user) => {
    const accessToken = sign ( {// le sign permet de savoir qu'est ce que j'enregistre dans le token 
        username : user.username , id : user._id, admin : user.admin
    } // ici c'est la signature lorsqu'on voudra créer un token il faura qu'il respect les trois règles définies précedemment
    , "SECRET"
    ) 
    
    return accessToken;
}

const validateToken = (req, res, next) => { // next correpond a faire l'action suivante
    const accessToken = req.cookies["accessToken"]
    console.log(accessToken);

    if(!accessToken) {
        return res.status(400).json({error : "User not Authenticated"})
        // ici 400 car c'est un erreur alors que le 404 c'est pour dire qu'il n'a pas trouver
    }
    try {
        const validToken = verify(accessToken, "SECRET");
        if(validToken){
            req.authenticated = true;
            return next();
        }

    } catch (error) {
        return res.status(400).json({error : error})
    }
}
module.exports = {createTokens, validateToken}