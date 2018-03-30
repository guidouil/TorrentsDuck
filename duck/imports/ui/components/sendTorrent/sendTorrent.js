import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { $ } from 'meteor/jquery';

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
              sAlert.success('Torrent added 😃');
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
        sAlert.error('URL must start with http:, https: or magnet: 😱');
        return false;
      }
      Meteor.call('addTorrent', torrentUrl, (transferError, success) => {
        document.getElementById('sendTorrentForm').reset();
        if (transferError) sAlert.error(transferError);
        if (success) {
          sAlert.success('Torrent added from URL 🚀');
        }
      });
      return true;
    }
    return false;
  },
});
