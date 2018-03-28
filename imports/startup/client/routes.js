import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/filesList/filesList.js';
import '../../ui/pages/explorer/explorer.js';
import '../../ui/pages/usersList/usersList.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/components/customAtForm/customAtForm.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('appBody', { main: 'home' });
  },
});

FlowRouter.route('/explorer', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'explorer',
  action() {
    BlazeLayout.render('appBody', { main: 'explorer' });
  },
});

FlowRouter.route('/files-list', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'filesList',
  action() {
    BlazeLayout.render('appBody', { main: 'filesList' });
  },
});

FlowRouter.route('/users-list', {
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  name: 'usersList',
  action() {
    BlazeLayout.render('appBody', { main: 'usersList' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('appBody', { main: 'notFound' });
  },
};

// UserAccounts routes
AccountsTemplates.configureRoute('changePwd', { redirect: '/' });
AccountsTemplates.configureRoute('forgotPwd', { redirect: '/' });
AccountsTemplates.configureRoute('resetPwd', { redirect: '/' });
AccountsTemplates.configureRoute('signIn', { redirect: '/' });
AccountsTemplates.configureRoute('signUp', { redirect: '/' });
AccountsTemplates.configureRoute('enrollAccount', { redirect: '/' });
AccountsTemplates.configureRoute('verifyEmail', { redirect: '/' });
AccountsTemplates.configureRoute('resendVerificationEmail', { redirect: '/' });
