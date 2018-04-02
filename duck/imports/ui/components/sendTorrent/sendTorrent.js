import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { $ } from 'meteor/jquery';
import { TAPi18n } from 'meteor/tap:i18n';

import TorrentFiles from '../../../api/torrentFiles/torrentFiles.js';
import './sendTorrent.html';

Template.sendTorrent.events({
  'click #torrentFileClick'() {
    $('#torrentFile').click();
  },
  'change #torrentFile'(event) {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const upload = TorrentFiles.insert({
        file: event.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
      }, false);

      upload.on('start', function() {
        document.getElementById('torrentFileInput').value = this.file.name;
      });

      upload.on('end', (error, fileObj) => {
        document.getElementById('sendTorrentForm').reset();
        if (error) {
          sAlert.error(error);
        } else {
          Meteor.call('addTorrent', fileObj.path, (transferError, success) => {
            if (transferError) sAlert.error(transferError);
            if (success) {
              sAlert.success(TAPi18n.__('start_message'));
            }
          });
        }
      });

      upload.start();
    }
  },
  'change #torrentUrl'(event) {
    const torrentUrl = event.currentTarget.value;
    if (torrentUrl) {
      if (!torrentUrl.startsWith('magnet:') && !torrentUrl.startsWith('http://') && !torrentUrl.startsWith('https://')) {
        sAlert.error(TAPi18n.__('wrong_url_message'));
        return false;
      }
      Meteor.call('addTorrent', torrentUrl, (transferError, success) => {
        document.getElementById('sendTorrentForm').reset();
        if (transferError) sAlert.error(transferError);
        if (success) {
          sAlert.success(TAPi18n.__('start_message'));
        }
      });
      return true;
    }
    return false;
  },
});
