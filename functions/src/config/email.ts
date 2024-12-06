import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});