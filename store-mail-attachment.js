import fs from 'fs';
import imaps from 'imap-simple';
import { READ_MAIL_CONFIG } from './config.js';

const readMyMail = () => {
  imaps.connect(READ_MAIL_CONFIG).then(function (connection) {
    connection.openBox('INBOX').then(function () {
      var delay = 24 * 3600 * 1000;
      var yesterday = new Date();
      yesterday.setTime(Date.now() - delay);
      yesterday = yesterday.toISOString();
      var searchCriteria = [['SINCE', yesterday]];
      var fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false, struct: true };
      return connection.search(searchCriteria, fetchOptions);
    }).then(function (messages) {
      var attachments = [];
      messages.forEach(function (message) {
      var parts = imaps.getParts(message.attributes.struct);
      
      const subject = message.parts.filter(function (part) {
        return part.which === 'HEADER';
      })[0].body.subject[0];
      
      attachments = attachments.concat(parts.filter(function (part) {
        return part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT';
      }).map(function (part) {
        return connection.getPartData(message, part)
          .then(function (partData) {
            const attachmentFolder = `./files`;
            if (!fs.existsSync(attachmentFolder)) fs.mkdirSync(attachmentFolder);
            let fileUrl = `${attachmentFolder}/${subject}.pdf`;
            let x = 0;
            while(fs.existsSync(fileUrl)) {
              fileUrl = `${attachmentFolder}/${subject}-${x}.pdf`;
              x += 1;
            }
            fs.createWriteStream(fileUrl).write(partData);
            return {
              filename: part.disposition.params.filename,
              data: partData
            };
          });
      }));
      });

      return Promise.all(attachments);
    }).then(function (attachments) {
      console.log("Invoice attachments saved successfully");
    });
  });
};

export default readMyMail;
