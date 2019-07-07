import { Mongo } from 'meteor/mongo';
import { PersistentMinimongo2 } from 'meteor/frozeman:persistent-minimongo2';

export const Conf = new Mongo.Collection('conf', { connection: null });
export const confObserver = new PersistentMinimongo2(Conf);
