import { Meteor } from 'meteor/meteor';

const validateUser = (user) => {
  if (!user) {
    throw new Meteor.Error(401, 'You must be signed in.');
  }
  if (!(user.isValid || user.isAdmin)) {
    throw new Meteor.Error(403, 'You are not authorized.');
  }
  return true;
};

export default validateUser;
