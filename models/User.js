const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : {type: 'string', required : true}, // le unique : true permet de faire en sorte que le username soit unique sur l'email c'est déjà automatique sur mongodb
    email : {type : 'string', required : true},
    password : {type : 'string', required : true},
    admin : { type: 'boolean'}
});

module.exports = mongoose.model('User', userSchema); 