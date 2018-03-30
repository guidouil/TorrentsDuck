// Definition of the Torrents collection

import { Mongo } from 'meteor/mongo';

const Torrents = new Mongo.Collection('torrents');

Torrents.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

export default Torrents;
