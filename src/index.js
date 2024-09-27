const express  = require('express');
const app = express();
const https = require('https');
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
const { UserCollection, WeatherCollection } = require('./mongodb'); 

const tempelatePath = path.join(__dirname , '../tempelates')
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.urlencoded({extended: false}))

app.get('/', (req , res) => {
  res.render("signup")
})

app.get('/login', (req , res) => {
  res.render("login");
})

app.post('/signup', async (req, res) => {
  try {
    const existingUser = await UserCollection.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }

    const data = {
      email: req.body.email,
    };
    const savedData = new UserCollection(data);
    await savedData.save();

    res.render("home", { email: req.body.email });
  } catch (err) {
    return res.status(500).json({
      error: 'Error while signing up',
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await UserCollection.findOne({ email: req.body.email });
    if (check) {
      if (check.email === req.body.email) {
        res.render("home", { email: req.body.email });
      } else {
        res.send("Wrong email");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    res.status(500).json({
      error: 'Error while logging in',
    });
  }
});



app.post('/', async (req, res) => {
  const query = req.body.cityName;
  const email = req.body.email;
  const apiKey = '4d8bf00bb34af0cc25e6e827592ce03c';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', async () => {
      try {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;

        const newWeatherData = {
          cityName: query,
          temperature: temp,
          desc: description,
        };

        const weatherRecord = new WeatherCollection(newWeatherData);
        await weatherRecord.save();

    
        const user = await UserCollection.findOne({ email: email });
        if (user) {
          user.weatherData.push(weatherRecord._id);
          await user.save();

          const populatedUser = await UserCollection.findById(user._id).populate('weatherData').exec();
          console.log(populatedUser);

          res.json({
            data: populatedUser,
          });
        } else {
          res.status(404).json({
            error: 'User not found',
          });
        }

      } catch (err) {
        res.status(500).json({
          error: 'Error while processing weather data',
        });
      }
    });
   })
  .on('error', (err) => {
    res.status(500).json({
      error: 'Error with the weather API request',
    });
  });
});


app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
