const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1) Middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('Hello from the middleware👏');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3) Route

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Start Server

module.exports = app;
