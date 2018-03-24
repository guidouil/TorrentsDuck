import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import './logo.html';

Template.logo.onRendered(() => {
  const instance = Template.instance();
  Meteor.setTimeout(() => {
    const effect = _.sample(['jiggle', 'tada', 'bounce', 'pulse', 'shake']);
    instance.$('#logo').transition(effect);
  }, 500);
});

Template.logo.helpers({
  class() {
    return this.class || '';
  },
  url() {
    return this.url || '';
  },
  src() {
    return this.src || '/img/duck.svg';
  },
});

Template.logo.events({
  'click #logo': (event, templateInstance) => {
    const effect = _.sample(['jiggle', 'tada', 'bounce', 'pulse', 'shake']);
    templateInstance.$('#logo').transition(effect);
    if (templateInstance.data.quack) {
      const quack = new Audio('/quack.mp3');
      quack.play();
    }
  },
});
