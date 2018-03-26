// Definition of the torrents files collection
import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

const Torrents = new FilesCollection({
  storagePath: Meteor.settings.uploadsPath,
  collectionName: 'torrentFiles',
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in torrent extension
    if (file.size <= 10485760 && /torrent/i.test(file.extension)) {
      return true;
    }
    return 'Please, only ".torrent" file.';
  },
});

export default Torrents;
