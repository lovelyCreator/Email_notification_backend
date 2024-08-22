const jwtEncode = require('jwt-encode')
const db = require("../models/index.js");
const { setToken } = require('../utils/verifyToken.js');
const { set } = require('mongoose');
const moment = require('moment');
const mailTrans = require("../utils/mailTrans.controller.js");
const nodeCron = require("../utils/nodeCron.js")

const setting = {frequency: "", dateTime: "", days: [], isWeekday: false, count: 1, sendMail: ()=>{} }
let tasks = [];


exports.emailHome = (req, res) => {
  // interval,
  // time,
  // date,
  // day,
  // query,
  // score,
  // email
  // isWeekday
  // count
  try {
    const response = req.body;
    const email = response.email.trim().split(',');
    setting.frequency = response.interval;
    // setting.time = response.time;
    setting.dateTime = response.dateTime;
    setting.days = response.days;
    // setting.email = response.email.trim().split(",");
    setting.isWeekday = response.isweekday;
    setting.count = response.count;
    const verSub = `Manage Bid Notification`;
    const verCnt = `Hello!
      This is John. You’ve requested notifications about ${response.query}.
      Have a great day,
      John`;

    console.log(setting);
    email.forEach(item => {
      item = item.trim();
      console.log('email: ', item);
      const date = new Date();
      // const pushNotification = nodeCron.pushNotify(date, item, verSub, verCnt, setting, response.number)
      setting.sendMail = async () => await mailTrans.sendMail(item, verSub, verCnt);
      newTasks = nodeCron.setNotification(setting);  
      if(newTasks) tasks.push(...newTasks);
      // const sendResult = mailTrans.sendMail(item, verSub, verCnt);
    })
    res.status(200).json({"message": 'You are Success'})
  } catch (e) {
    console.error(e);
    res.status(500).json({"message": 'Internal Sever Error.'})
    
  }
}

exports.unset = (req, res) => {
  try{
    console.log(tasks);
    tasks.map(
      (task) => {
        // console.log("aaaa:", task);
        task.stop();
        return 0;
      }
    );
    res.status(200).json({"message": "Successfully unset."})
  }catch (e) {
    console.log(e);
    res.status(500).json({"message": 'Internal Sever Error.'})
  }
}