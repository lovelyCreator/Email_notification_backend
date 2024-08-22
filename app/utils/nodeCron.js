const cron = require('node-cron');
const mailTrans = require('./mailTrans.controller.js');
const { shuffled } = require('ethers/lib/utils.js');

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

  exports.setNotification = (setting) => {  
    let tasks = [];
    let {frequency, dateTime, days, isWeekday, count, sendMail} = {...setting};
    console.log("setting: ", setting);
    if(frequency !== "")
        frequency = Number(frequency);
    else frequency = Infinity;
    const limit = 24 * 60 / frequency;
    count = count > limit ? limit : count;
    if(count === 0) {
      count = 1;
      frequency = 0;
    }
    console.log("isWeekday: ", isWeekday);
    // let [hour, minute] = time.split(":");
    // hour = Number(hour);
    // minute = Number(minute);
    if(!isWeekday){
        const startTime = new Date(dateTime);
        
        // startTime.setHours(hour);
        // startTime.setMinutes(minute);
        console.log("startTime: ", startTime);
        for(let i=0; i<count; i++){
            let scheduleTime = new Date(startTime.getTime() + 1000 * 60 * frequency * i);
            console.log("scheduleTime: ",scheduleTime)
            const task = cron.schedule(
                scheduleTime.getMinutes() + " " + scheduleTime.getHours() + " " + scheduleTime.getDate() + " " + (scheduleTime.getMonth()+1) + " *",
                async () => {
                    console.log(scheduleTime)
                    sendMail();
                }
            );
            task.start();
            tasks.push(task);
        }
    }
    else {
        const startTime = new Date();
        startTime.setHours(hour);
        startTime.setMinutes(minute);
        console.log("startTime: ", startTime);
        for(let i=0; i<count; i++){
            let scheduleTime = new Date(startTime.getTime() + 1000 * 60 * frequency * i);
            console.log("scheduleTime: ",scheduleTime)
            const task = cron.schedule(
                scheduleTime.getMinutes() + " " + scheduleTime.getHours() + " * * " + days.filter(item => item.value).map(item => item.text).join(","),
                async () => {
                    console.log(scheduleTime);
                    sendMail()
                }
            );
            task.start();
            tasks.push(task);
        }
    }
    return tasks;
  }