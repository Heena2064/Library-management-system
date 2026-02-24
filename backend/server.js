const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
require ('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');
const seatRoutes = require('./routes/seatRoutes');
const attendaceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

//middleware 
app.use (cors());
app.use(express.json());



//only for testing 
app.get("/test", (req, res) => {
  res.send("Test route working");
});


//test route
app.get('/', (req,res)=> {
    res.send('API is running');
})

app.use('/api/auth', authRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/attendance', attendaceRoutes);
app.use('/api/admin', adminRoutes);


//temporrray 
app.get('/api/protected', protect, (req,res)=> {
  res.json({
    message:'Protected route accessed',
    user:req.user,
  });
});

//conect mongodb
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
  });



/*const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working perfectly");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});*/
