var _       = require('lodash'),
    Promise = require('bluebird'),
    request = Promise.promisify(require("request"));

function InstagramGrabber(clientId) {
  this.clientId = clientId;
}

InstagramGrabber.prototype.fetchPhotos = function(userId, maxId) {
  console.log("fetch photos");
  return request({
    url: 'https://api.instagram.com/v1/users/'
        + userId + '/media/recent/?client_id=' + this.clientId
        + (maxId ? ('&max_id=' + maxId) : ''),
    json: true,
    method: 'get'
  }).spread(function(resp, body) {
    // if (resp.code >= 400 && resp.code <= 500) {
    //   throw new StatusError(body, resp.code);
    // }
    return body.data;
  });
}

InstagramGrabber.prototype.getUserId = function(username) {
  console.log("Get user id");
  return request({
    url: 'https://api.instagram.com/v1/users/search?q='
    + username + '&client_id=' + this.clientId,
    json: true,
    method: 'get'
  }).spread(function(resp, body) {
    // if (resp.code >= 400 && resp.code <= 500) {
    //   throw new StatusError(body, resp.code);
    // }
    return body.data[0].id;
  });
}

InstagramGrabber.prototype.searchByUsernameAndHashtag = function(username, hashtag, amount) {
  console.log("Search by u and hash");
  var __this = this;
  return this.getUserId(username)
    .then(function(userId) {
      return __this.getPhotosWithHashtag(userId, hashtag, amount);
    });
}

InstagramGrabber.prototype.getPhotosWithHashtag = function(userid, hashtag, amount, maxId) {
  console.log("Get photos with hash");
  var __this = this;
  return this.fetchPhotos(userid, maxId).then(function(photos) {
    if (photos.length === 0) {
      return [];
    }

    var photosWithHashtag = _.filter(photos, function(photo, idx) {
      return _.contains(photo.tags, hashtag);
    });

    if (photosWithHashtag.length < amount) {
      var lastId = _.last(photos).id;
      return __this.getPhotosWithHashtag(userid, hashtag,
        amount - photosWithHashtag.length, lastId)
      .then(function(pics) {
          return _.union(photosWithHashtag, pics);
      });
    } else {
      console.log("Returning" , photosWithHashtag);
      return photosWithHashtag;
    }
  });
};

module.exports = InstagramGrabber;







