const jwtEncode = require('jwt-encode')
const db = require("../models/index.js");
const { setToken } = require('../utils/verifyToken.js');
const { set } = require('mongoose');
const moment = require('moment');
const mailTrans = require("../utils/mailTrans.controller.js");
const nodeCron = require("../utils/nodeCron.js")

const setting = {
  frequency: '',
  startTime: '',
  startDate: ''
}


exports.emailHome = (req, res) => {
  try {
    const response = req.body();
    console.log(response);
    const mail = response.mail.split(', ');
    setting.frequency = response.frequency;
    setting.startTime = response.startTime;
    setting.startDate = response.startDate;
    const verSub = `Manage Bid Notification`
    const verCnt = `Hello!
      This is John. You’ve requested notifications about ${response.searchQuery}.
      Have a great day,
      John`
    mail.forEach(item => {
      console.log('email: ', item);
      const date = new Date();
      // const pushNotification = nodeCron.pushNotify(date, item, verSub, verCnt, setting, response.number)
      const sendResult = mailTrans.sendMail(item, verSub, verCnt);
    })
    res.status(200).json({"message": 'You are Success'})
  } catch (e) {
    console.error(e);
    res.status(500).json({"message": 'Internal Sever Error.'})
    
  }
}

