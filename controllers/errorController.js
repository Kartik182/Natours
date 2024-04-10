const AppError=require('../utils/appError')
const handleCasteErrorDB =err=>{
  const message=`Invalid ${err.path}:${err.value}`;
  return new AppError(message,400)
}
const handleDuplicateFieldsDB=err=>{
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: ${value}. Use another value.`;
  return new AppError(message, 400);
}
const handleValidationErrorDB=err=>{
  const errors=Object.values(err.errors).map(el=>el.message);
  const message=`invalid input data.${errors.join('. ')}`;
  return new AppError(message,400)
}
const sendErrorDev=(err,res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    error:err,
    message: err.message,
    stack: err.stack,
  });
}
const handleJWTError=()=>new AppError("Invalid token.please login again",401);
const handleJWTExpiredError=()=>new AppError("IYour token has expired please login again!",401);
const sendErrorProd=(err,res)=>{
  if(err.isOperational){
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}else{
  console.error('Error💥',err)
  res.status(500).json({
    status:"Error",
    message:"something went very wrong"
  });
}
}
module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err,res);
  }
  else if(process.env.NODE_ENV === 'production'){
    let error=JSON.parse(JSON.stringify(err));
    if(error.name==='CastError') error=handleCasteErrorDB(error);
    if(error.code===11000) error=handleDuplicateFieldsDB(error);
    if(error.name==="ValidationError") error=handleValidationErrorDB(error);
    if(error.name==="JsonWebTokenError") error=handleJWTError();
    if(error.name==="TokenExpiredError") error=handleJWTExpiredError();
    sendErrorProd(error,res);
  }
};
