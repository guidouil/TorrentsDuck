// Methods related to Transfers
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import fs from 'fs';

import Transfers from './transfers.js';
import Files from '../files/files.js';
import webTorrentClient from '../../startup/server/webTorrentClient.js';

Meteor.methods({
  'startTransfer'(torrentRef) {
    check(torrentRef, String);
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(401, 'You must be signed in.');
    }
    if (!(user.isValid || user.isAdmin)) {
      throw new Meteor.Error(403, 'You are not validated yet.');
    }
    const userId = Meteor.userId();

    async function upsertTransfer (_id, transfer) {
      return Transfers.upsert({ _id }, { $set: transfer });
    }

    const path = Meteor.settings.torrentsPath;
    webTorrentClient.add(torrentRef, { path }, (torrent) => {
      if (torrent.ready) {
        const transfer = {
          name: torrent.name,
          downloadSpeed: 0,
          uploadSpeed: 0,
          timeRemaining: '',
          createdAt: new Date(),
          torrentRef,
          userId,
        };
        upsertTransfer(torrent.infoHash, transfer).then(result => result);
      }
    });
    return true;
  },
  'pauseTransfer'(torrentId) {
    check(torrentId, String);
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(401, 'You must be signed in.');
    }
    if (!(user.isValid || user.isAdmin)) {
      throw new Meteor.Error(403, 'You are not validated yet.');
    }
    const torrent = webTorrentClient.get(torrentId);
    if (!torrent) {
      throw new Meteor.Error(404, 'Torrent not found.');
    }
    torrent.pause();
    return Transfers.update({ _id: torrentId }, { $set: { paused: true } });
  },
  'resumeTransfer'(torrentId) {
    check(torrentId, String);
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(401, 'You must be signed in.');
    }
    if (!(user.isValid || user.isAdmin)) {
      throw new Meteor.Error(403, 'You are not validated yet.');
    }
    const torrent = webTorrentClient.get(torrentId);
    if (!torrent) {
      throw new Meteor.Error(404, 'Torrent not found.');
    }
    torrent.resume();
    return Transfers.update({ _id: torrentId }, { $set: { paused: false } });
  },
  'removeTransfer'(torrentId) {
    check(torrentId, String);
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(401, 'You must be signed in.');
    }
    if (!(user.isValid || user.isAdmin)) {
      throw new Meteor.Error(403, 'You are not validated yet.');
    }
    const torrent = webTorrentClient.get(torrentId);
    if (torrent) {
      // save references to Files collection
      const transfer = Transfers.findOne({ _id: torrentId });
      if (transfer && transfer.progress === 1) {
        // archive torrent info
        const { name, files, size, torrentRef, createdAt } = transfer;
        Files.upsert({ _id: torrentId }, { name, files, size, torrentRef, createdAt });
      } else if (transfer.files) {
        // Delete files
        _.each(transfer.files, (file) => {
          const filePath = Meteor.settings.torrentsPath + file;
          fs.unlinkSync(filePath);
        });
      }
      webTorrentClient.remove(torrentId);
    }
    return Transfers.remove({ _id: torrentId });
  },
});
