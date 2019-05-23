import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import FtpSrv from 'ftp-srv';

Meteor.startup(() => {
  const ftpServer = new FtpSrv({
    url: `ftp://0.0.0.0:${Meteor.settings.public.ftpPort}`,
    // pasv_url: 'ftp://0.0.0.0',
    pasv_min: Meteor.settings.ftpPasvMin,
    pasv_max: Meteor.settings.ftpPasvMax,
    greeting: 'Welcome to Torrents Duck FTP server',
    // timeout: 60000,
  });

  async function isValidUser(username, password) {
    const user = await Accounts.findUserByUsername(username);
    if (!user || !(user.isValid || user.isAdmin)) {
      return false;
    }
    // eslint-disable-next-line no-underscore-dangle
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
