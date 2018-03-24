import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 1) {
    Meteor.users.update({}, { $set: { isAdmin: true } });
  }
});
