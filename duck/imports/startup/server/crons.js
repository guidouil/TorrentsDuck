import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { _ } from 'meteor/underscore';


SyncedCron.config({
  log: false,
  collectionTTL: 3600,
});

SyncedCron.add({
  name: 'Give duck statistics',
  schedule(parser) {
    return parser.text('every 30 sec');
  },
  job() {
    Meteor.call('giveStatistics');
  },
});

SyncedCron.start();
