import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

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
  const pad = (s) => (s < 10) ? `0${s}` : s;
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
});
