// All Statistics-related publications

import { Meteor } from 'meteor/meteor';
import Statistics from '../statistics.js';

import validateUser from '../../validateUser.js';


Meteor.publish('allStatistics', () => {
  const user = Meteor.user();
  if (!validateUser(user)) return false;

  return Statistics.find();
});
