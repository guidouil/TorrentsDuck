import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './header.html';
import '../logo/logo.js';

Template.header.events({
  'click #logout'() {
    $('#logoutModal').modal({
      onApprove: () => {
        Meteor.logout();
      },
    }).modal('show');
  },
});
