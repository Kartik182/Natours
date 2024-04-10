const dotenv = require('dotenv');
process.on("uncaughtException", err=>{
  console.log("Unhandled Exception💥 Shutting down...");
  console.log(err.name,err.message);
  console.log(err.stack);
});
dotenv.config({ path: './config.env' });
const mongoose =require('mongoose');

const app = require('./app');
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(DB).then(()=>{console.log('db connection successfull');})


// const testTour=new Tour({
//   name:'forest hiker',
//   rating:4.7,
//   price:497
// })

// testTour.save().then(doc=>{
//   console.log(doc);
// }).catch(err=>{
//   console.log("Error: " + err);
// })


const port = process.env.PORT || 3000;
console.log(app.get('env'));
const server=app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});

process.on('unhandledRejection', err=>{
  console.log("Unhandled rejection💥 Shutting down...");
  console.log(err.name,err.message);
  server.close(()=>{
    process.exit(1);
  })
});