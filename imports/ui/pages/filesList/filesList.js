import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Files from '../../../api/files/files';

import './filesList.html';

Template.filesList.onCreated(() => {
  const instance = Template.instance();
  instance.filesPagination = new Meteor.Pagination(Files, {
    sort: {
      createdAt: -1,
    },
  });
});

Template.filesList.helpers({
  filesPagination() {
    return Template.instance().filesPagination;
  },
  filesList() {
    return Template.instance().filesPagination.getPage();
  },
});
