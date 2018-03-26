import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import fs from 'fs';

import Files from './files.js';

Meteor.methods({
  deleteFiles(_id) {
    check(_id, String);
    const fileRef = Files.findOne({ _id });
    if (fileRef && fileRef.files) {
      _.each(fileRef.files, (file) => {
        const filePath = Meteor.settings.torrentsPath + file;
        fs.unlink(filePath, (error) => {
          if (error) {
            throw new Meteor.Error(500, error);
          }
        });
      });
      Files.remove({ _id });
    }
  },
});
