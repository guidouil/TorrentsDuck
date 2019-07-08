import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { $ } from 'meteor/jquery';
import { Conf } from '/imports/api/conf/conf';

import './header.html';
import '../logo/logo.js';

Template.header.onRendered(function() {
  $('.dropdown').dropdown();
});

Template.header.helpers({
  isFrench() {
    return TAPi18n.getLanguage() === 'fr';
  },
  darkModeIcon() {
    const conf = Conf.findOne({ _id: 'me' });
    return conf && conf.darkMode ? 'sun' : 'moon';
  },
});

Template.header.events({
  'click #logout'() {
    $('#logoutModal')
      .modal({
        onApprove: () => {
          Meteor.logout();
        },
      })
      .modal('show');
  },
  'click #darkMode'() {
    const conf = Conf.findOne({ _id: 'me' });
    const darkMode = (conf && conf.darkMode) || false;
    Conf.upsert({ _id: 'me' }, { $set: { darkMode: !darkMode } });
  },
  'click .setLang'(event) {
    localStorage.setItem('lang', event.target.id);
    if (Meteor.userId()) {
      Meteor.users.update(
        { _id: Meteor.userId() },
        { $set: { 'profile.language': event.target.id } },
      );
    }
  },
});
