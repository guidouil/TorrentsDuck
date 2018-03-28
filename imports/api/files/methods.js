import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import fs from 'fs';

import Files from './files.js';

const validateUser = (user) => {
  if (!user) {
    throw new Meteor.Error(401, 'You must be signed in.');
  }
  if (!(user.isValid || user.isAdmin)) {
    throw new Meteor.Error(403, 'You are not authorized.');
  }
  return true;
};

Meteor.methods({
  deleteFiles(_id) {
    check(_id, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;

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
    return true;
  },
  listFiles(path = '') {
    check(path, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;
    if (path.startsWith('.') || path.includes('/.')) {
      throw new Meteor.Error(420, 'Hack detected.');
    }

    const realPath = Meteor.settings.torrentsPath + path;
    if (!fs.existsSync(realPath)) {
      throw new Meteor.Error(404, 'Path not found.');
    }
    const stat = fs.statSync(realPath);
    if (!stat.isDirectory()) {
      throw new Meteor.Error(420, 'This is not a directory.');
    }
    const rawList = fs.readdirSync(realPath);
    const filesList = [];
    rawList.forEach((rawName) => {
      if (!rawName.startsWith('.')) { // no hidden files
        const rawPath = `${realPath}/${rawName}`;
        const rawStat = fs.statSync(rawPath);
        const niceFile = {
          name: rawName,
          size: rawStat.size,
          isDirectory: rawStat.isDirectory(),
          isFile: rawStat.isFile(),
        };
        filesList.push(niceFile);
      }
    });
    return filesList;
  },
});
