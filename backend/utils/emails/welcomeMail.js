// Import the necessary modules here
import nodemailer from "nodemailer";
// import fs from "fs";
// import path from "path";

export const sendWelcomeEmail = async (user) => {
  
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.STORFLEET_SMPT_MAIL,
        pass: process.env.STORFLEET_SMPT_MAIL_PASSWORD,
      },
    });
    console.log("env", process.env.STORFLEET_SMPT_MAIL, process.env.STORFLEET_SMPT_MAIL_PASSWORD );


    const emailOptions = {
      from: process.env.STORFLEET_SMPT_MAIL,
      to: user.email,
      subject: "Welcome to StoreFleet",
      html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          /* Add your custom CSS styles here */
          body {
            font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            color: #4c004c;
            text-align:center;
          }
          .header {
            text-align: center;
          }
          .logo {
            max-width: 150px;
          }
          .content {
            margin-top: 20px;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #20d49a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          /* Mobile Responsive Styles */
          @media only screen and (max-width: 600px) {
            .container {
              padding: 10px;
            }
            .logo {
              max-width: 100px;
            }
            .button {
              display: block;
              margin-top: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img class="logo" src="https://placehold.co/600x400/png" alt="Storefleet Logo" />
            <h1>Welcome to Storefleet</h1>
          </div>
          <div class="content">
            <p>Hello, ${user.name}</p>
            <p>Thank you for registering with Storefleet. We're excited to have you as a new member of our community.</p>
            <p><a class="button" href="http://localhost:${process.env.PORT}/api/storefleet/users/login">Get Started</a></p>
          </div>
        </div>
      </body>
    </html>`,
    };

    await transporter.sendMail(emailOptions);
    console.log("mail sent successfully");
  } catch (err) {
    console.log("Error occured while sending welcom email to the client", err.message);
  }







};
