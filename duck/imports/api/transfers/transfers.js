// Definition of the Transfers collection

import { Mongo } from 'meteor/mongo';

const Transfers = new Mongo.Collection('transfers');

Transfers.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

export default Transfers;
