const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


try {
  (async () => {
    await mongoose.connect('mongodb+srv://amit:amit@organsdonor.cd5433k.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('MongoDB connected!!');
  })();
} catch (err) {
  console.log(err);
}

module.exports = mongoose;
