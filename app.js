const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const connectDB = require("./db/db.js");
const Query = require("./db/queryModel.js");

dotenv.config();

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.post('/send-mail', (req, res) => {
  const modal = req.body.modal;
  const name = req.body.Name;
  const email = req.body.MailAdress;
  const phone = req.body.PhoneNumber;

  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sinergia@tlp-ins.co.il',
      pass: process.env.PASSWORD_FOR_MAIL,
    },

  });

  const mailOptions = {
    from: 'sinergia@tlp-ins.co.il',
    to: 'sinergia@tlp-ins.co.il',
  };

  let subject = '';
  let message = '';
  let leadComeFrom = 'גורם מפנה: אשמורת - מירב בן אריה \n';

  if (modal === 'modal1') {
    subject = ' ליד ייעוץ משכנתא';
    const agreement = req.body.agreement === '1' ? 'כן' : req.body.agreement === '2' ? 'לא' : 'לא ידוע';
    const loanAmount = req.body.loanAmount === '1' ? 'כן' : req.body.loanAmount === '2' ? 'לא' : 'לא ידוע';
    const checkConditions = req.body.checkConditions === '1' ? 'כן' : req.body.checkConditions === '2' ? 'לא' : 'לא ידוע';

    message = leadComeFrom + `יעוץ משכנתא\nהאם נחתם הסכם? ${agreement}\nהאם גובה המשכנתה מעל 75%? ${loanAmount}\nהאם תרצה שנבדוק שהתנאים של המשכנתה שלך טובים גם להיום? ${checkConditions}\nשם מלא: ${name}\nכתובת מייל: ${email}\nטלפון: ${phone}\n`;
    mailOptions.to = "calcali@tlp-ins.co.il";
  } else if (modal === 'modal2') {
    subject = 'ליד החזרי מס';
    const taxPayment = req.body.taxPayment === '1' ? 'כן' : req.body.taxPayment === '2' ? 'לא' : 'לא ידוע';
    const abroadTrip = req.body.abroadTrip === '1' ? 'כן' : req.body.abroadTrip === '2' ? 'לא' : 'לא ידוע';
    const jobChange = req.body.jobChange === '1' ? 'כן' : req.body.jobChange === '2' ? 'לא' : 'לא ידוע';
    const pensionFund = req.body.pensionFund === '1' ? 'כן' : req.body.pensionFund === '2' ? 'לא' : 'לא ידוע';
    const academicDegree = req.body.academicDegree === '1' ? 'כן' : req.body.academicDegree === '2' ? 'לא' : 'לא ידוע';
    const stockMarketActivity = req.body.stockMarketActivity === '1' ? 'כן' : req.body.stockMarketActivity === '2' ? 'לא' : 'לא ידוע';

    message = leadComeFrom + `החזרי מס\nהאם אתה משלם מס בתלוש השכר שלך? ${taxPayment}\nהאם יצאת לחל"ת? ${abroadTrip}\nהאם החלפת מקום עבודה ב-6 שנים האחרונות? ${jobChange}\nהאם משכת קופת פנסיה או גמל בשנים האחרונות? ${pensionFund}\nהאם יש לך תואר אקדמאי? ${academicDegree}\nהאם יש לך פעילות בשוק ההון? ${stockMarketActivity}\nשם מלא: ${name}\nכתובת מייל: ${email}\nטלפון: ${phone}\n`;
    mailOptions.to = "bmass@tlp-ins.co.il";
  }
  else if (modal == 'contact-us') {
    subject = 'שאילתה כללית';
    message = leadComeFrom + `.\nשם מלא: ${name}\nכתובת מייל: ${email}\nטלפון: ${phone}\nהודעה: ${req.body.Message}\n`;
  }
  let messageForDB = req.body.Message
  mailOptions.subject = subject;
  mailOptions.text = message;

  const query = new Query({
    name: name,
    email: email,
    phoneNumber: phone,
    subject: subject,
    message: messageForDB,
    createdAt: new Date(),
  })

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.send('<script>alert("יש בעיה בשליחת הליד, אנא נסה שנית"); window.location.href = "/";</script>');
    } else {
      console.log('Email sent:', info.response);
      query.save();
      res.send('<script>alert("נשלח בהצלחה"); window.location.href = "/";</script>');
    }

  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});




