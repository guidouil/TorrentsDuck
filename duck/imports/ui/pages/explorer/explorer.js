import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import { $ } from 'meteor/jquery';

import './explorer.html';

import '../../components/serverStatus/serverStatus.js';

Template.explorer.onCreated(() => {
  const instance = Template.instance();
  instance.filesList = new ReactiveVar();
  instance.currentPath = new ReactiveVar('/');
  instance.breadCrumbs = new ReactiveVar([]);
  instance.sort = new ReactiveVar('date');
  instance.search = new ReactiveVar();
});

Template.explorer.onRendered(() => {
  const instance = Template.instance();
  $('.dropdown').dropdown();
  instance.autorun(() => {
    const sort = instance.sort.get();
    const currentPath = instance.currentPath.get();
    const search = instance.search.get();
    Meteor.call('listFiles', currentPath, (error, filesList) => {
      if (error) {
        sAlert.error(error);
      }
      if (filesList) {
        let sortedFilesList = sortBy(filesList, sort);
        if (sort !== 'name') {
          sortedFilesList.reverse();
        }
        if (search) {
          sortedFilesList = filter(sortedFilesList, (file) =>
            file.name.toLowerCase().includes(search.toLowerCase()),
          );
        }
        instance.filesList.set(sortedFilesList);
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
  search() {
    return Template.instance().search.get();
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
    const query = event.target.value;
    if (!query) {
      templateInstance.search.set('');
    } else {
      templateInstance.search.set(query);
    }
  },
  'change #sort'(event, templateInstance) {
    if (event.target.value) {
      templateInstance.sort.set(event.target.value);
    }
  },
  'click #clearSearch'(event, templateInstance) {
    templateInstance.search.set('');
  },
});
