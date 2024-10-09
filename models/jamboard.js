const mongoose = require('mongoose');

const JamboardSchema = new mongoose.Schema({
    owner : {
        type :  mongoose.Schema.Types.ObjectId
    },
    name : {
        type : String,
        required : true
    },
    data : [
       {
           type : Object
       }
    ],
    users : [
        {
            userid: { 
                type: mongoose.Schema.Types.ObjectId
            },

            permissionWrite:{
                type:Boolean
            }

        }

    ]
})

module.exports = mongoose.model('Jamboard', JamboardSchema);