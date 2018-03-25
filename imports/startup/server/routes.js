import { Meteor } from 'meteor/meteor';

import fs from 'fs';

import { JsonRoutes } from 'meteor/simple:json-routes';

JsonRoutes.add('get', '/file/:name', function (req, res) {
  const filename = req.params.name;
  if (filename && fs.existsSync(`${Meteor.settings.torrentsPath}${filename}`)) {
    // indicate a download and set the filename of the returned file
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename=${filename}`,
    });
    // read a stream from the local filesystem, and pipe it to the response object
    fs.createReadStream(`${Meteor.settings.torrentsPath}${filename}`).pipe(res);
  } else {
    // otherwise indicate that the name is not recognised
    res.writeHead(400);
    res.end(`cannot find ${filename}`);
  }
});
