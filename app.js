const express = require('express');
const app = express();
const port = process.env.PORT|| 5000
const weatherRouter=require('./routes/weatherRouter')

require('dotenv').config();
const cors = require('cors');
app.use(cors())
app.use(express.json());

app.get('/',(req, res) => {
    res.send(`Weather App`)
})

app.use('/api/v1/weather',weatherRouter)

const start = async () => {
    try {
        await app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }
    catch (error) {
        console.log(error)
    }
}

start();