const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    tls:{
        rejectUnauthorized:false
    }
})

module.exports = {
    sendEmail(from,to,subject,html){
        return new Promise((resolve,reject)=>{
            transport.sendEmail({from,subject,to,html},(err,info)=>{
                if(err) reject(err);
                resolve(info);
                console.log("Mail ");
                console.log(info);
            });
        });
    }
}