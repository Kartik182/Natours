const nodemailer=require("nodemailer");

const sendEmail=async options=>{
    //create transporter
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    });
    //define email options
    const mailOptions={
        from:'Kartik garg<gargkartik182@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message,
        // html
    }
    //send email 
    await transporter.sendMail(mailOptions);
};
module.exports=sendEmail;