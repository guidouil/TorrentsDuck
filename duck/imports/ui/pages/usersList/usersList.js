import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { ReactiveVar } from 'meteor/reactive-var';

import './usersList.html';

Template.usersList.onCreated(() => {
  const instance = Template.instance();
  instance.subscribe('usersList');
  instance.thisUsername = new ReactiveVar();
});

Template.usersList.helpers({
  users() {
    return Meteor.users.find({}, { sort: { createdAt: -1 } });
  },
  thisUsername() {
    return Template.instance().thisUsername.get();
  },
  shortDate(d) {
    if (!d) {
      return '';
    }
    const pad = (s) => (s < 10) ? `0${s}` : s;
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  },
});

Template.usersList.events({
  'click .validateUser'() {
    const user = this;
    Meteor.call('setUserValidity', user._id, true, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.success(`User "${user.username}" validated`);
      }
    });
  },
  'click .inValidateUser'() {
    const user = this;
    Meteor.call('setUserValidity', user._id, false, (error, success) => {
      if (error) sAlert.error(error);
      if (success) {
        sAlert.warning(`User "${user.username}" invalidated`);
      }
    });
  },
  'click .removeUser'(event, templateInstance) {
    const user = this;
    templateInstance.thisUsername.set(user.username);
    $('#removeUserModal').modal({
      onApprove: () => {
        Meteor.call('removeUser', user._id, false, (error, success) => {
          if (error) sAlert.error(error);
          if (success) {
            sAlert.success(`User "${user.username}" removed`);
          }
        });
      },
    }).modal('show');
  },
});
