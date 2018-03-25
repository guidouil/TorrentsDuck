// Definition of the Files collection

import { Mongo } from 'meteor/mongo';

const Files = new Mongo.Collection('files');

Files.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

export default Files;
