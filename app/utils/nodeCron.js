const cron = require('node-cron');
const mailTrans = require('./mailTrans.controller.js')

const MailTransfer = async (email, subject, content) => {
    try {
        if (clinician) {
        const sendResult = await mailTrans.sendMail(email, subject, content);
        console.log('Email sent successfully:', sendResult);
        } else {
        console.error('Clinician not found for:', firstName, lastName);
        }
    } catch (error) {
        console.error('Error fetching clinician or sending email:', error);
    }
}


exports.pushNotify = (reminderTime, sendEmail, subject, content, setting, number) => {  
    console.log('pending---', reminderTime);
  
    if (reminderTime.getHours() < 2) {
      reminderTime.setHours(reminderTime.getHours() + 22);
      reminderTime.setDate(reminderTime.getDate() - 1);
    } else {
      reminderTime.setHours(reminderTime.getHours() - 2);
    }
    now = new Date(Date.now());
    if(reminderTime.getTime() < now.getTime()){
      console.log(reminderTime, now);
      reminderTime.setHours(reminderTime.getHours() + 1);
      if(reminderTime.getTime() < now.getTime())
        return false;
      else{
        now.setMinutes(now.getMinutes() + 1);
        reminderTime = now;
      }
    }
    console.log(reminderTime);
    cron.schedule(
      reminderTime.getMinutes() +
        " " +
        reminderTime.getHours() +
        " " +
        reminderTime.getDate() +
        " " +
        (reminderTime.getMonth() + 1) +
        " *",
      async () => {
        console.log("Reminder sent");
        MailTransfer(sendEmail, subject, content);         
      }
    );
    return true;  
  }