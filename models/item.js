const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    user_id: String, // holds patient id
    name: String, // holds patient name
    category_id: String, // which organ
    detail: String,
    age: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    gender: String,
    bp: String,
    blood_type: String,
    deceased: { type: Boolean, default: false },
    /// heart
    heart_disease: { type: Boolean, default: false },
    obesity: { type: Boolean, default: false },
    diabetes: { type: Boolean, default: false },
    inotropes: { type: String, default: null },
    ////// liver
    blood_sugar: { type: String, default: null },
    hepatitis: { type: Boolean, default: false },
    creatinine: { type: Number, default: 0 },
    cancer: { type: Boolean, default: false },
    hiv: { type: Boolean, default: false },
    gfr: { type: Number, default: 0 },
    //// lungs
    lungs_count: { type: Number, default: 0 },
    smoking_years: { type: Number, default: 0 },
    is_pulminory: { type: Boolean, default: false },
    is_pulminory_edema: { type: Boolean, default: false },
    sepsis: { type: Boolean, default: false },
    lung_trauma: { type: Boolean, default: false },

    date: { type: Number, default: new Date().getTime() },
    sold: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  { collection: 'items' }
);

let Item = mongoose.model('items', ItemSchema);

module.exports = Item;
