const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/WeatherData')
    .then(() => console.log('mongoose connected'))
    .catch((e) => console.log('failed', e));

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique :true,
    },
    weatherData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Weather',
    }]
});

const weatherSchema = new mongoose.Schema({
    cityName: String,
    temperature: Number,
    desc: String,
});

const UserCollection = mongoose.model('User', userSchema);
const WeatherCollection = mongoose.model('Weather', weatherSchema);

module.exports = {
    UserCollection,
    WeatherCollection
};
