import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import './tchat.html';
import Tchats from '../../../api/tchats/tchats';

Template.tchat.onCreated(() => {
  const instance = Template.instance();
  instance.subscribe('latestTchats');
});

Template.tchat.onRendered(() => {
  $('#messageInput').focus();
});

Template.tchat.helpers({
  tchats() {
    return Tchats.find({}, { sort: { when: 1 } });
  },
});

Template.tchat.events({
  'keypress #messageInput'(event, templateInstance) {
    if (event.which === 13) {
      $('#messageInput').addClass('loading');
      Meteor.call('insertTchat', event.target.value, (error, success) => {
        $('#messageInput').removeClass('loading');
        if (error) sAlert.error(error);
        if (success) event.target.value = '';
      });
    }
  },
});
