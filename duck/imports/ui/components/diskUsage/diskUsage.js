import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import './diskUsage.html';

import Statistics from '../../../api/statistics/statistics.js';

Template.diskUsage.onCreated(() => {
  const instance = Template.instance();
  instance.subscribe('allStatistics');
});

Template.diskUsage.helpers({
  diskUsage() {
    const system = Statistics.findOne({ _id: 'system' });
    if (system) {
      const { diskUsage } = system;
      $('#diskUsage').progress({
        value: diskUsage.total - diskUsage.available,
        total: diskUsage.total,
        showActivity: false,
      });
      return diskUsage;
    }
    return false;
  },
});
