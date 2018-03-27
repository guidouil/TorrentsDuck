import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import FtpSrv from 'ftp-srv';

Meteor.startup(() => {
  let ftpAddress = `ftp://${Meteor.settings.serverIp}:${Meteor.settings.public.ftpPort}`;
  if (Meteor.isDevelopment) {
    ftpAddress = `ftp://127.0.0.1:${Meteor.settings.public.ftpPort}`;
  }
  const ftpServer = new FtpSrv(ftpAddress, {
    pasv_range: Meteor.settings.ftpPasvRange,
    greeting: 'Welcome to Torrents Duck FTP server',
  });

  async function isValidUser (username, password) {
    const user = await Accounts.findUserByUsername(username);
    if (!user || !(user.isValid || user.isAdmin)) {
      return false;
    }
    const result = await Accounts._checkPassword(user, password);
    if (result.error) {
      return false;
    }
    return true;
  }

  ftpServer.on('login', ({ username, password }, resolve, reject) => {
    isValidUser(username, password).then((result) => {
      if (result) {
        resolve({ root: Meteor.settings.torrentsPath });
      } else {
        reject(new Error('Invalid username or password...'));
      }
    });
  });

  ftpServer.listen();
});
