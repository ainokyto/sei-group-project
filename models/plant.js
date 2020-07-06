const mongoose = require('mongoose')

//* each comment has to fit this schema criteria
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

const offerSchema = new mongoose.Schema({
  offer: { type: String, required: true },
  text: { type: String, required: false },
  imageUrl: { type: String, required: false },
  plantId: { type: String, required: false },
  name: { type: String, required: false },
  user: { type: Object, required: true }
}, {
  timestamps: true
})

const plantSchema = new mongoose.Schema({
  nickName: { type: String, required: false },
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  trefleId: { type: Number, required: false },
  imageUrl: { type: String, required: true },
  description: { type: String, required: false, maxlength: 1000 },
  height: { type: String, required: true },
  location: { type: Array, validate: {
    validator: function(obj) {
      return Object.keys(obj).length > 0
    }
  }},
  likes: [{ userId: String, username: String }, {  required: false  }], 
  comments: [ commentSchema ],
  offers: [ offerSchema ],
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})



plantSchema.plugin(require('mongoose-unique-validator'))

module.exports =   ( mongoose.model('Offer', offerSchema), mongoose.model('Plant', plantSchema) )
