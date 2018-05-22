import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { _ } from 'meteor/underscore';

import Torrents from './collections/torrents.js';

SyncedCron.config({
  log: false,
  collectionTTL: 3600,
});

SyncedCron.add({
  name: 'Check for torrents actions',
  schedule(parser) {
    return parser.text('every 10 sec');
  },
  job() {
    // Watching for torrents to start
    const torrentsToStart = Torrents.find({ toStart: true }).fetch();
    if (torrentsToStart && torrentsToStart.length > 0) {
      _.each(torrentsToStart, (torrentToStart) => {
        Meteor.call('startTorrent', torrentToStart);
      });
    }

    // watching torrents to stop
    const torrentsToStop = Torrents.find({ toStop: true }).fetch();
    if (torrentsToStop && torrentsToStop.length > 0) {
      _.each(torrentsToStop, (torrentToStop) => {
        Meteor.call('stopTorrent', torrentToStop);
      });
    }

    // watching torrents to remove
    const torrentsToRemove = Torrents.find({ toRemove: true }).fetch();
    if (torrentsToRemove && torrentsToRemove.length > 0) {
      _.each(torrentsToRemove, (torrentToRemove) => {
        Meteor.call('removeTorrent', torrentToRemove);
      });
    }
  },
});

SyncedCron.add({
  name: 'Give torrents statistics',
  schedule(parser) {
    return parser.text('every 10 sec');
  },
  job() {
    Meteor.call('giveStatistics');
  },
});

SyncedCron.start();
