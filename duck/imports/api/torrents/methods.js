// Methods related to Torrents
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import validateUser from '../validateUser.js';

import Torrents from './torrents.js';

Meteor.methods({
  addTorrent(torrentRef) {
    check(torrentRef, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;

    return Torrents.insert({
      torrentRef,
      username: user.username,
      userId: user._id,
      toStart: true,
      createdAt: new Date(),
    });
  },
  startTorrent(torrentId) {
    check(torrentId, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;

    return Torrents.update({ _id: torrentId }, {
      $set:
        {
          toStart: true,
        },
    });
  },
  stopTorrent(torrentId) {
    check(torrentId, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;

    return Torrents.update({ _id: torrentId }, {
      $set:
        {
          toStop: true,
        },
    });
  },
  removeTorrent(torrentId) {
    check(torrentId, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;

    return Torrents.update({ _id: torrentId }, {
      $set:
        {
          toRemove: true,
        },
    });
  },
});
