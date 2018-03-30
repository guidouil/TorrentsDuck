import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './serverStatus.html';

Template.serverStatus.onCreated(() => {
  const instance = Template.instance();
  instance.loadAverage = new ReactiveVar();
  instance.diskUsage = new ReactiveVar();
});

Template.serverStatus.onRendered(() => {
  const instance = Template.instance();
  Meteor.call('loadAverage', (error, loadAverage) => {
    if (error) {
      console.error(error);
    }
    if (loadAverage) {
      instance.loadAverage.set(loadAverage);
    }
  });
  Meteor.call('diskUsage', (error, diskUsage) => {
    if (error) {
      console.error(error);
    }
    if (diskUsage) {
      $('#diskUsage').progress({
        value: diskUsage.total - diskUsage.available,
        total: diskUsage.total,
      });
      instance.diskUsage.set(diskUsage);
    }
  });
});

Template.serverStatus.helpers({
  loadAverage() {
    return Template.instance().loadAverage.get();
  },
  diskUsage() {
    return Template.instance().diskUsage.get();
  },
  ftpPort() {
    return Meteor.settings.public.ftpPort;
  },
});
