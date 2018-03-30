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
      progress: 1,
    },
  });
});

Template.transfersList.onRendered(() => {
  $('.dropdown').dropdown();
});

Template.transfersList.helpers({
  transfersPagination() {
    return Template.instance().transfersPagination;
  },
  tranfers() {
    return Template.instance().transfersPagination.getPage();
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
  'click .stopTorrent'() {
    const torrent = this;
    Meteor.call('stopTorrent', torrent.torrentId, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.info('Torrent stopping');
      }
    });
  },
  'click .startTorrent'() {
    const torrent = this;
    Meteor.call('startTorrent', torrent.torrentId, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.success('Torrent starting');
      }
    });
  },
  'click .removeTorrent'() {
    const torrent = this;
    Meteor.call('removeTorrent', torrent.torrentId, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.success('Torrent being removed');
      }
    });
  },

  'change #perPage'(event, templateInstance) {
    templateInstance.transfersPagination.perPage(Number(event.target.value));
  },
  'change #sort'(event, templateInstance) {
    const sort = {};
    sort[event.target.value] = 1;
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
