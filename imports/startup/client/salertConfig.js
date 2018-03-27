import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Meteor.startup(() => {
  sAlert.config({
    effect: 'stackslide',
    position: 'top-right',
    timeout: 3000,
    html: false,
    onRouteClose: false,
    stack: true,
    beep: {
      error: '/quack.mp3',
      warning: '/quack.mp3',
    },
  });
});
