// Definition of the Statistics collection

import { Mongo } from 'meteor/mongo';

const Statistics = new Mongo.Collection('statistics');

Statistics.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

export default Statistics;
