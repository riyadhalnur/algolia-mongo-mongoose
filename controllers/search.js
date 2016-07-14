'use strict';

const algolia = require('algoliasearch');
const async = require('async');

const client = algolia('applicationID', 'apiKey');

const _updateItem = (index, item, callback) => {
  index.saveObject(item, callback);
};

const _atomicUpdateItem = (index, item, callback) => {
  index.partialUpdateObject(item, callback);
};

const _deleteItem = (index, item, callback) => {
  index.deleteObject(item.objectID, callback);
};

const search = {
  add: (indexName, items, callback) => {
    const index = client.initIndex(indexName);
    index.addObjects(items, callback);
  },
  update: (indexName, items, callback) => {
    const index = client.initIndex(indexName);
    async.map(items, async.apply(_updateItem, index), callback);
  },
  atomicUpdate: (indexName, items, callback) => {
    const index = client.initIndex(indexName);
    async.map(items, async.apply(_atomicUpdateItem, index), callback);
  },
  delete: (indexName, items, callback) => {
    const index = client.initIndex(indexName);
    async.map(items, async.apply(_deleteItem, index), callback);
  },
  doSearch: (indexName, searchTerm, callback) => {
    const index = client.initIndex(indexName);

    index.search(searchTerm, (err, result) => {
      if (err) {
        return callback(err);
      }

      return callback(result);
    });
  }
};

module.exports = search;
