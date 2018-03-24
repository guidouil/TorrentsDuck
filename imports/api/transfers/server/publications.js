// All transfers related publications
import { Meteor } from 'meteor/meteor';
import { publishPagination } from 'meteor/kurounin:pagination';

import Transfers from '../transfers.js';

publishPagination(Transfers);
