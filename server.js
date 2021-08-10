const express  = require('express');
const path = require('path')

const app = express()

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 9000 || process.env.PORT

app.listen(PORT, () => console.log(`chat server running on port ${PORT}`))