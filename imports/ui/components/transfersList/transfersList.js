import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { $ } from 'meteor/jquery';
import { ReactiveVar } from 'meteor/reactive-var';

import Transfers from '../../../api/transfers/transfers.js';

import './transfersList.html';

Template.transfersList.onCreated(() => {
  const instance = Template.instance();
  instance.transfersPagination = new Meteor.Pagination(Transfers, {
    perPage: 50,
    sort: {
      progress: -1,
    },
  });
  instance.currentFiles = new ReactiveVar();
  instance.torrentsStats = new ReactiveVar();
  Meteor.call('getTorrentsStats', (error, torrentsStats) => {
    if (error) sAlert.error(error);
    if (torrentsStats) {
      instance.torrentsStats.set(torrentsStats);
    }
  });
});

Template.transfersList.onRendered(() => {
  $('.dropdown').dropdown();
  const instance = Template.instance();
  Meteor.setInterval(() => {
    Meteor.call('getTorrentsStats', (error, torrentsStats) => {
      if (error) sAlert.error(error);
      if (torrentsStats) {
        instance.torrentsStats.set(torrentsStats);
      }
    });
  }, 10000);
});

Template.transfersList.helpers({
  transfersPagination() {
    return Template.instance().transfersPagination;
  },
  tranfers() {
    return Template.instance().transfersPagination.getPage();
  },
  currentFiles() {
    return Template.instance().currentFiles.get();
  },
  torrentsStats() {
    return Template.instance().torrentsStats.get();
  },
  initProgress() {
    const torrent = this;
    setTimeout(() => {
      $(`#progress${torrent._id}`).progress({
        total: 1,
        value: torrent.progress,
      });
    }, 100);
  },
  convertMs(ms) {
    if (!ms || ms === Infinity) {
      return ms;
    }
    let h;
    let m;
    let s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s %= 60;
    h = Math.floor(m / 60);
    m %= 60;
    const d = Math.floor(h / 24);
    h %= 24;
    return `${d}d ${h}h ${m}m ${s}s`;
  },
  truncate(name, size) {
    if (name && name.length > size) {
      return `${name.substring(0, size)}…`;
    }
    return name;
  },
});

Template.transfersList.events({
  'click .pauseTorrent'() {
    const torrent = this;
    Meteor.call('pauseTransfer', torrent._id, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.info(`Torrent "${torrent.name}" peers search paused`);
      }
    });
  },
  'click .resumeTorrent'() {
    const torrent = this;
    Meteor.call('resumeTransfer', torrent._id, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.success(`Torrent "${torrent.name}" peers search restarted`);
      }
    });
  },
  'click .removeTorrent'() {
    const torrent = this;
    Meteor.call('removeTransfer', torrent._id, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.success(`Torrent "${torrent.name}" removed`);
      }
    });
  },
  'click .restartTorrent'() {
    const torrent = this;
    Meteor.call('getTorrent', torrent._id, (getError, getSuccess) => {
      if (getError) sAlert.error(getError);
      if (getSuccess) {
        sAlert.warning('Torrent already in queue 😕');
        return false;
      }
      Meteor.call('startTransfer', torrent.torrentRef, (error, success) => {
        if (error) sAlert.error(error);
        if (success) {
          sAlert.success(`Torrent "${torrent.name}" restarted`);
        }
      });
      return true;
    });
    return false;
  },
  'change #perPage'(event, templateInstance) {
    templateInstance.transfersPagination.perPage(Number(event.target.value));
  },
  'change #sort'(event, templateInstance) {
    const sort = {};
    sort[event.target.value] = -1;
    templateInstance.transfersPagination.sort(sort);
  },
  'input #search'(event, templateInstance) {
    const filters = templateInstance.transfersPagination.filters();
    if (event.target.value) {
      filters['$or'] = [
        { name: { $regex: event.target.value, '$options': 'i' } },
        { tags: { $regex: event.target.value, '$options': 'i' } },
      ];
    } else if (filters.$or) {
      delete filters.$or;
    }
    templateInstance.transfersPagination.filters(filters);
  },
  'change #myTorrents'(event, templateInstance) {
    const filters = templateInstance.transfersPagination.filters();
    if (event.target.checked) {
      filters.userId = Meteor.userId();
    } else if (filters.userId) {
      delete filters.userId;
    }
    templateInstance.transfersPagination.filters(filters);
  },
});
