import { Meteor } from 'meteor/meteor';

import validateUser from '../../validateUser';
import Tchats from '../tchats.js';

Meteor.publish('latestTchats', () => {
  const user = Meteor.user();
  if (!validateUser(user)) {
    return false;
  }
  return Tchats.find({});
});
