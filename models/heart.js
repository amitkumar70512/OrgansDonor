const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const heartSchema = new Schema({
    organ_id: String,
    patient_id: String,
    patient_name:String,
    age: Number,
    height: Number,
    weight: Number,
    gender: String,
    BP: String,
    Blood_type:String,
    heart_disease: Boolean,
    obesity: Boolean,
    diabetes: Boolean,
    heart_abnormalities: String,
    inotropes: String
},
{ collection: 'heart' });


let Heart = mongoose.model('heart', heartSchema);

module.exports = Heart;