const mongoose = require('mongoose');
const {model} = require('mongoose')
const url = "mongodb://localhost:27017";
const bcrypt = require('bcrypt');
const { boolean } = require('joi');
mongoose.connect(url).then(()=>{
    console.log("Monoose connected");
}).catch((e)=>{
    console.log(e);
})


const Userschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    admin:{
        type:boolean,
        default:false
    }
});

Userschema.virtual('name').get(function(){
return `${this.name} and ${this.email}`;
})

Userschema.pre('save',async function (next) {
    this.HashedPassword = await bcrypt.hash(this.password , 10);
    next();
});
const UserModels = model("Usermodels",Userschema);

module.exports = {
    UserModels
}