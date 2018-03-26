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
    sort: {
      progress: -1,
    },
  });
  instance.currentFiles = new ReactiveVar();
});

Template.transfersList.onRendered(function() {
  $('.dropdown').dropdown();
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
  truncate(name) {
    if (name && name.length > 50) {
      return `${name.substring(0, 50)}...`;
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
        sAlert.success(`Torrent "${torrent.name}" paused`);
      }
    });
  },
  'click .resumeTorrent'() {
    const torrent = this;
    Meteor.call('resumeTransfer', torrent._id, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.success(`Torrent "${torrent.name}" restarted`);
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
  'click .transferName'(event, templateInstance) {
    templateInstance.currentFiles.set(this.files);
    $('.filesModal').modal('show');
  },
});
