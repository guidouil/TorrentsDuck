// Definition of the Tchats collection

import { Mongo } from 'meteor/mongo';

const Tchats = new Mongo.Collection('tchats');

Tchats.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

export default Tchats;
