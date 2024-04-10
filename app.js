const express = require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const path=require('path');

const app = express();
const AppError=require('./utils/appError')
const globalErrorHandler=require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes')

app.set('view engine','pug');
app.set('views',path.join(__dirname, 'views'));
//middleware
//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname,'public')));

//set security http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'to many request from this ip please try again in an error'
});

app.use('/api',limiter);

app.use(express.json({ limit:'10kb'}));

//data sanitisation against Nosql query injection
app.use(mongoSanitize());
//data sanitisation against XSS
//html code and js
 
app.use(xss());
//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);





// app.use((req, res, next) => {
//   console.log('hello from middleware😑');
//   //  res.send("hello");
//   next();
// });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//varialbes

//routes
app.get('/',(req,res)=>{
  res.status(200).render('base');
})
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.all('*',(req,res,next)=>{
  // res.status(404).json({
  //   status:"fail",
  //   message:`can't find ${req.originalUrl} on this server`
  // })
  // const err=new Error(`can't find ${req.originalUrl} on this server`);
  // err.status='fail';
  // err.statusCode=404;
  next(new AppError(`can't find ${req.originalUrl} on this server`),404);
})
app.use(globalErrorHandler);
module.exports = app;
