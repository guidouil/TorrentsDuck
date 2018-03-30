// Methods related to System
import { Meteor } from 'meteor/meteor';
import os from 'os';
import disk from 'diskusage';

Meteor.methods({
  loadAverage() {
    return os.loadavg();
  },
  diskUsage() {
    return disk.checkSync('/');
  },
});
