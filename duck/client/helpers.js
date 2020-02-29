import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Conf } from '/imports/api/conf/conf';

Template.registerHelper('isValidOrIsAdmin', () => {
  const user = Meteor.user();
  if (user) {
    return user.isValid || user.isAdmin;
  }
  return false;
});

Template.registerHelper('shortDate', (d) => {
  if (!d) {
    return '';
  }
  const pad = (s) => (s < 10 ? `0${s}` : s);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
});

Template.registerHelper('shortDateTime', (d) => {
  if (!d) {
    return '';
  }
  const pad = (s) => (s < 10 ? `0${s}` : s);
  return `${[pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
});

Template.registerHelper('humanFileSize', (bytes, si) => {
  if (bytes !== 0 && !bytes) {
    return false;
  }
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
});

Template.registerHelper('roundTwo', (num) => {
  if (num !== 0 && !num) {
    return '';
  }
  return Math.round(num * 100) / 100;
});

Template.registerHelper('makeLink', (path, filename = '') => {
  const shortPath = path.substr(1); // remove first slash
  return `/file/${encodeURIComponent(shortPath + filename)}`;
});

Template.registerHelper('equals', (a, b) => {
  return a === b;
});

Template.registerHelper('isDark', (color) => {
  const conf = Conf.findOne({ _id: 'me' });
  if (conf && conf.darkMode === true) {
    return 'inverted' || color;
  }
  return '';
});
