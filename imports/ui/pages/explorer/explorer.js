import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import './explorer.html';

Template.explorer.onCreated(() => {
  const instance = Template.instance();
  instance.filesList = new ReactiveVar();
  instance.currentPath = new ReactiveVar('/');
  instance.breadCrumbs = new ReactiveVar([]);
});

Template.explorer.onRendered(() => {
  const instance = Template.instance();
  instance.autorun(() => {
    const currentPath = instance.currentPath.get();
    Meteor.call('listFiles', currentPath, (error, filesList) => {
      if (error) {
        sAlert.error(error);
      }
      if (filesList) {
        instance.filesList.set(filesList);
      }
    });
  });
});

Template.explorer.helpers({
  filesList() {
    return Template.instance().filesList.get();
  },
  isRootDirectory() {
    const currentPath = Template.instance().currentPath.get();
    return currentPath === '/';
  },
  currentPath() {
    return Template.instance().currentPath.get();
  },
  noSlash(path, filename) {
    const shortPath = path.substr(1);
    return `/file/${encodeURIComponent(shortPath + filename)}`;
  },
});

Template.explorer.events({
  'click .changePath'(event, templateInstance) {
    const currentPath = templateInstance.currentPath.get();
    const breadCrumbs = templateInstance.breadCrumbs.get();
    breadCrumbs.push(currentPath);
    templateInstance.breadCrumbs.set(breadCrumbs);
    const newPath = `${currentPath}${this.name}/`;
    templateInstance.currentPath.set(newPath);
  },
  'click .goParentDirectory'(event, templateInstance) {
    const breadCrumbs = templateInstance.breadCrumbs.get();
    const newPath = breadCrumbs[breadCrumbs.length - 1];
    breadCrumbs.splice(-1, 1);
    templateInstance.breadCrumbs.set(breadCrumbs);
    templateInstance.currentPath.set(newPath);
  },
  'input #searchFile'(event, templateInstance) {

  },
});
