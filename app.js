var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var colors = require('colors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// ================= MONGODB CONNECTION =================
console.log("Mongo URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB is Connected".cyan.underline))
.catch((error) => console.log(`❌ Error: ${error.message}`.red.underline.bold));

// ================= MIDDLEWARES =================
app.use(cors({ origin: "*" }));
app.use(logger('dev'));
app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());

// ================= ROUTES =================
app.use('/', indexRouter);
app.use('/users', usersRouter);

// ================= ERROR HANDLER =================
// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (prevents Express from trying to render 'error.ejs')
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ success: false, message: err.message || "Server Error" });
});

// ================= SERVER =================
const port = process.env.PORT || 2556;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${port}`.green.underline);
});

module.exports = app;
