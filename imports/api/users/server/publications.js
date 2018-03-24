import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('userExtraFields', () => {
  if (Meteor.userId()) {
    return Meteor.users.find(
      { _id: Meteor.userId() },
      { fields: { isAdmin: 1, isValid: 1 } },
    );
  }
  return false;
});

Meteor.publish('userInfo', (userId) => {
  check(userId, String);
  if (Meteor.userId() && userId) {
    return Meteor.users.find(
      { _id: userId },
      { fields: { 'profile.name': 1, emails: 1 } },
    );
  }
  return false;
});

Meteor.publish('usersList', () => {
  const user = Meteor.user();
  if (!user || !user.isAdmin) {
    throw new Meteor.Error(403, 'You must be an admin');
  }
  return Meteor.users.find();
});
