import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import validateUser from '../validateUser';
import Tchats from './tchats';

Meteor.methods({
  insertTchat(message) {
    check(message, String);
    const user = Meteor.user();
    if (!validateUser(user)) {
      throw new Meteor.Error('403', 'Your are not autorised');
    }
    const by = user.username;
    const when = new Date();
    return Tchats.insert({ message, by, when });
  },
});
