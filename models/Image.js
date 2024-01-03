const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
        titre : {type : 'String'},
        image : {type : 'String'}
})

module.exports = mongoose.model('Image', imageSchema)