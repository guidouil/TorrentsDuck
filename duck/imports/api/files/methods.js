import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import fs from 'fs';

import validateUser from '../validateUser.js';

Meteor.methods({
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
