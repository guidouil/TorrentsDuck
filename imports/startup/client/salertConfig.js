import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Meteor.startup(() => {
  sAlert.config({
    effect: 'stackslide',
    position: 'bottom-right',
    timeout: 3000,
    html: false,
    onRouteClose: true,
    stack: true,
    beep: '/quack.mp3',
  });
});
