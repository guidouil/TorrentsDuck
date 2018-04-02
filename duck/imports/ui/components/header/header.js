import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { $ } from 'meteor/jquery';

import './header.html';
import '../logo/logo.js';

Template.header.helpers({
  isFrench() {
    return TAPi18n.getLanguage() === 'fr';
  },
});

Template.header.events({
  'click #logout'() {
    $('#logoutModal').modal({
      onApprove: () => {
        Meteor.logout();
      },
    }).modal('show');
  },
});
