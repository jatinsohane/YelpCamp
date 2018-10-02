var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    
    text:String,
    author:{
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"//"ref" refers to the model which we are going to refer for this id
        },
        
        username:String
    },
});


module.exports = mongoose.model("Comment",commentSchema); 