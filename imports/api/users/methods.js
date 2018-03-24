import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  setUserValidity(_id, validity) {
    check(_id, String);
    check(validity, Boolean);
    const user = Meteor.user();
    if (!user || !user.isAdmin) {
      throw new Meteor.Error(403, 'You must be an admin');
    }
    const isValid = validity;
    return Meteor.users.update({ _id }, { $set: { isValid } });
  },
  removeUser(_id) {
    check(_id, String);
    const user = Meteor.user();
    if (!user || !user.isAdmin) {
      throw new Meteor.Error(403, 'You must be an admin');
    }
    return Meteor.users.remove({ _id });
  },
});
