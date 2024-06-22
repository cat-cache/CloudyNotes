const mongoose= require('mongoose')
const express= require("express")
const cors=require("cors")
const dotenv= require("dotenv")



dotenv.config();
const app = express()
app.use(cors());
const PORT= process.env.PORT || 7000;
const MONGOURL= process.env.MONGO_URL;
app.use(express.json());
mongoose.connect(MONGOURL).then(()=>{
  console.log("CONNECTED");
  
}).catch((error)=>{console.log(error)})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth',require("./routes/auth"));
app.use('/api/notes',require("./routes/notes"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})


