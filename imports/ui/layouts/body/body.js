import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './body.html';

import '../../components/header/header.js';

Template.appBody.onCreated(() => {
  Meteor.subscribe('userExtraFields');
});
