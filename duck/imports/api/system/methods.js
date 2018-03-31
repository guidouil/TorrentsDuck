// Methods related to System
import { Meteor } from 'meteor/meteor';
import os from 'os';
import disk from 'diskusage';

import Statistics from '../statistics/statistics.js';

Meteor.methods({
  loadAverage() {
    return os.loadavg();
  },
  diskUsage() {
    return disk.checkSync('/');
  },
  giveStatistics() {
    this.unblock();
    if (this.connection !== null) {
      throw new Meteor.Error('403', 'Not authorized');
    }

    const system = {
      loadAverage: os.loadavg(),
      diskUsage: disk.checkSync('/'),
    };
    return Statistics.upsert({ _id: 'system' }, { $set: system });
  },
});
