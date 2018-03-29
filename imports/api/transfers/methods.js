// Methods related to Transfers
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import fs from 'fs';

import Transfers from './transfers.js';
import Files from '../files/files.js';
import webTorrentClient from '../../startup/server/webTorrentClient.js';

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
  'getTorrent'(torrentId) {
    check(torrentId, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;

    const torrent = webTorrentClient.get(torrentId);
    if (torrent) {
      return true;
    }
    return false;
  },
  'startTransfer'(torrentRef) {
    check(torrentRef, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;

    async function upsertTransfer (_id, transfer) {
      await Transfers.upsert({ _id }, { $set: transfer });
    }

    const maxConns = Meteor.settings.torrentMaxConnections;
    const path = Meteor.settings.torrentsPath;
    const userId = user._id;
    webTorrentClient.add(torrentRef, { maxConns, path }, (torrent) => {
      if (torrent.ready) {
        const transfer = {
          name: torrent.name,
          downloadSpeed: 0,
          uploadSpeed: 0,
          timeRemaining: '',
          createdAt: new Date(),
          stopped: false,
          torrentRef,
          userId,
        };
        upsertTransfer(torrent.infoHash, transfer);
      }
    });
    return true;
  },
  'pauseTransfer'(torrentId) {
    check(torrentId, String);
    const user = Meteor.user();
    if (!validateUser(user)) return false;

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
    if (!validateUser(user)) return false;

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
    if (!validateUser(user)) return false;

    const torrent = webTorrentClient.get(torrentId);
    if (torrent) {
      // save references to Files collection
      const transfer = Transfers.findOne({ _id: torrentId });
      if (transfer && transfer.progress === 1) {
        // archive torrent info
        const {
          name, size, torrentRef, createdAt,
        } = transfer;
        Files.upsert({ _id: torrentId }, {
          name, size, torrentRef, createdAt,
        });
      } else if (transfer.files) {
        // Delete incomplete files
        _.each(transfer.files, (file) => {
          const filePath = Meteor.settings.torrentsPath + file;
          fs.unlinkSync(filePath);
        });
      }
      // allways remove torrent
      webTorrentClient.remove(torrentId);
    }
    return Transfers.remove({ _id: torrentId });
  },
  getTorrentsStats() {
    const user = Meteor.user();
    if (!validateUser(user)) return false;

    const down = webTorrentClient.downloadSpeed;
    const up = webTorrentClient.uploadSpeed;
    return { down, up };
  },
});
