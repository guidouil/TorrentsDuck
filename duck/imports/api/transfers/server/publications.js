// All transfers related publications
import { publishPagination } from 'meteor/kurounin:pagination';

import Transfers from '../transfers.js';
import validateUser from '../../validateUser';

publishPagination(Transfers, {
  dynamic_filters: () => {
    const user = Meteor.user();
    if (validateUser(user)) {
      return {};
    }
    return false;
  },
});
