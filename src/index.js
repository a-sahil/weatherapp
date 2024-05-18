const express  = require('express');
const app = express();
const https = require('https');
const path = require('path');
const hbs = require('hbs');
//const { collection, weatherCollection } = require('./mongodb'); 
const collection = require('./mongodb'); 

const tempelatePath = path.join(__dirname , '../tempelates')
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.urlencoded({exended:false}))

app.get('/login', (req , res) => {
  res.render("login");
})

app.get('/', (req , res) => {
  res.render("signup");
})


app.post("/signup", async(req , res) => {
   const data = {
    name: req.body.name,
    password: req.body.password
   }

    await collection.insertMany([data])
    res.render("home")

})

app.post("/login", async(req , res) => {
 try{
  const check = await collection.findOne({name: req.body.name} , {password: req.body.password})
  if(check.name === req.body.password && check.password === req.body.password){
    res.render("home")
  }
  else{
    res.send("wrong Password")
  }

 }
 catch{
  res.send("wrong details")
 }

 }
)

app.post('/',  (req, res) => {
  const query = req.body.cityName;
  const apiKey = '4d8bf00bb34af0cc25e6e827592ce03c';
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey + '&units=metric';

  https.get(url, (response) => {
      let data = '';
      

      response.on('data', (chunk) => {
          data += chunk;
      });

      response.on('end', async () => {
          const weatherData = JSON.parse(data);
          const temp = weatherData.main.temp;
          const description = weatherData.weather[0].description;
          // Sending  the response to the client
         res.send("<h1>The temperature in " + query + " is " + temp + " degree celsius </h1>" +
              "<p> Feels like: " + description + "</p>");

              const newData = {
                cityName: query,
                temperature: temp,
                desc: description
            };

            await collection.insertMany([newData]);
      });
  });
});


app.listen(3000 , () => {
  console.log(`port connected at http://localhost:3000`);
})