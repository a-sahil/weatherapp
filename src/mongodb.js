const {mongoose , Schema} =require("mongoose")

mongoose.connect("mongodb://localhost:27017/WeatherData")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})
// const weatherSchema = new mongoose.Schema({
//   cityName: {
//       type: String
//   },
//   temperature: {
//       type: Number
//   },
//   desc: {
//       type: String
//   },
// });

const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    password:{
        type:String, 
    },
    weather: [{
        cityName: {
            type: String
        },
        temperature: {
            type: Number
        },
        desc: {
            type: String
        },
      }]
});


const collection = mongoose.model('Collection1', LogInSchema);
// const weatherCollection = mongoose.model('WeatherCollection1', weatherSchema);
// module.exports = {collection  , weatherCollection}

 module.exports = collection;