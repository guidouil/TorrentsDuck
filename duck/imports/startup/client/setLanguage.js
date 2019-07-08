import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { TAPi18n } from 'meteor/tap:i18n';
import { T9n } from 'meteor/softwarerero:accounts-t9n';

const localStoredLanguage = () => localStorage.getItem('lang');

const userLanguage = () => {
  // If the user is logged in, retrieve their saved language
  if (Meteor.user()) return Meteor.user().profile.language;
  return false;
};

if (Meteor.isClient) {
  Meteor.startup(() => {
    Tracker.autorun(() => {
      let lang;

      // URL Language takes priority
      const urlLang = FlowRouter.getQueryParam('lang');
      if (urlLang) {
        lang = urlLang;
      } else if (localStoredLanguage()) {
        // Local storage is set if no url lang
        lang = localStoredLanguage();
      } else if (userLanguage()) {
        // User language is set if no url lang and no local storage
        lang = userLanguage();
      } else {
        // If no user language, try setting by browser (default en)
        const localeFromBrowser = window.navigator.userLanguage || window.navigator.language;
        let locale = 'en';

        if (localeFromBrowser.match(/en/)) locale = 'en';
        if (localeFromBrowser.match(/fr/)) locale = 'fr';

        lang = locale;
      }
      TAPi18n.setLanguage(lang);
      T9n.setLanguage(lang);

      // Semantic UI Form validation translation
      // $.fn.form.settings.prompt = {
      //   empty: TAPi18n.__('form.empty'),
      //   checked: TAPi18n.__('form.checked'),
      //   email: TAPi18n.__('form.email'),
      //   url: TAPi18n.__('form.url'),
      //   integer: TAPi18n.__('form.integer'),
      //   maxLength: TAPi18n.__('form.maxLength'),
      // };
    });
  });
}
