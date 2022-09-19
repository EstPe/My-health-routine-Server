const express = require("express");
var nodemailer = require("nodemailer");
// const { print } = require("../html/soldOut");
var transporter;
transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "peretz398@gmail.com",
        pass: "jrzyezxqzzlhvuzl",
    },
});
class EmailService {
    newUser = (email) => {
        var mailOptions = {
            from: "peretz398@gmail.com",
            to: email.email,
            subject: `Welcome ${email.name}`,

            html: {
                path: "C:/Users/Ester/projectFinall/node.js/connectNode/html/send.html",
            },
        };

        this.test(mailOptions);
    };
    soldOut = (soldOutPro) => {
        var mailOptions = {
            from: "peretz398@gmail.com",
            to: "peretz398@gmail.com",
            subject: `sold out product `,
            html: ` <h1 align="center">Manager product is soldOut</h1>`,
        };
        let i = 0;
        mailOptions.html = ` <h1 align="center">Manager product is soldOut</h1>
        <img src="https://www.jetsetter.com//uploads/sites/7/2018/04/15AF_lmk-1380x690.jpeg" style="max-height: 250px; width: 50%; margin-right: 25%" />
        <table style=" margin-right: 25%;width: 50%">
            <tr>
            <th>quantity</th>
                <th>name</th>
                <th>image</th>
            </tr>
    
            <tr *ngFor="let cart of soldOutPro" >
                <td>${soldOutPro[i].Quantity}</td>
                <td>${soldOutPro[i].name}</td>
                <td><img src="${soldOutPro[i++].image}" width="100"/></td>
            </tr>
          
        </table>
        <p align="center">please check the webside</p>`;
        this.test(mailOptions);
    };
    order = (soldOutPro, emailUser, sum) => {
        var mailOptions = {
            from: "peretz398@gmail.com",
            to: emailUser.email,
            subject: `Thank you for your order `,
            html: ` <h1 align="center">${emailUser.name} Thank you for your order</h1>
              <h3 align="right">total price after delivery ${sum}</h3>
            <img src="https://img.freepik.com/premium-vector/thank-you-your-order-card-design-online-buyers-illustration-vector_180786-94.jpg?w=2000" style="max-height: 550px; width: 100%;margin-left:25%" />`,
        };

        this.test(mailOptions);
    };
    tempPassword = (password, emailUser) => {
        var mailOptions = {
            from: "peretz398@gmail.com",
            to: emailUser.email,
            subject: `Forget password`,
            html: ` <h1 align="center">we send you your temporary password</h1>
            <h3>password: ${password}</h3>`,
        };
        this.test(mailOptions);
    };
    sendReminder = (emailUser) => {
        var mailOptions = {
            from: "peretz398@gmail.com",
            to: "peretz398@gmail.com",
            subject: `alert for taking your medican`,
            html: `<a href="http://localhost:4200/reminder">click here</a><span>to approve or not</span>`,
        };
        this.test(mailOptions);
    };
    medRunOut = (emailUser) => {
        var mailOptions = {
            from: "peretz398@gmail.com",
            to: emailUser.email,
            subject: `medican stoke runing out`,
            html: `<h1 align="center">medican stoke runing out please restock if necessary</h1>
        <img src="https://www.jetsetter.com//uploads/sites/7/2018/04/15AF_lmk-1380x690.jpeg" style="max-height: 250px; width: 50%; margin-right: 25%" />
        `,
        };
        this.test(mailOptions);
    };
    missTaking = (emailUser) => {
        var mailOptions = {
            from: "peretz398@gmail.com",
            to: "peretz398@gmail.com",
            subject: `notice you miss take a pill`,
            html: `
      <h1> hey user you miss take</h1>
      <h4>we expand your taking dates for one more day </h4>
      <h5>My Health Routine team</h5>
        <img src="https://www.jetsetter.com//uploads/sites/7/2018/04/15AF_lmk-1380x690.jpeg" style="max-height: 250px; width: 50%; margin-right: 25%" />
        `,
        };
        this.test(mailOptions);
    };
    stopTaking = (emailUser) => {
        var mailOptions = {
            from: "peretz398@gmail.com",
            to: "peretz398@gmail.com",
            subject: `notice you did not approve`,
            html: `
      <h1> hey user you did not approv taking pills latly</h1>
      <h4>we will stop sending reminder  </h4>
      <h5>My Health Routine team</h5>
        <img src="https://www.jetsetter.com//uploads/sites/7/2018/04/15AF_lmk-1380x690.jpeg" style="max-height: 250px; width: 50%; margin-right: 25%" />
        `,
        };
        this.test(mailOptions);
    };
    test(mailOptions) {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                //  res.json({ message: "email did not send" });
            } else {
                console.log("Email sent: " + info.response);
                // res.json({ message: "email has been send" });
            }
        });
    }
}
const emailService = new EmailService();
module.exports = emailService;