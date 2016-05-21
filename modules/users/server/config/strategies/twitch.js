'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  TwitchStrategy = require('passport-twitch').Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  passport.use(new TwitchStrategy({
    clientID: config.twitch.clientID,
    clientSecret: config.twitch.clientSecret,
    callbackURL: config.twitch.callbackURL,
    scope: 'user_read'
  },
  function (req, accessToken, refreshToken, profile, done) {

    console.log('-=] passport-twitch [=-\n\n' +
                 'req:\n' + req + '\n\n' +
                 'accessToken:\n' + accessToken + '\n\n' +
                 'refreshToken:\n', refreshToken, '\n\n' +
                 'profile:\n', profile, '\n\n' +
                 'done:\n' + done);

    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // Create the user OAuth profile
    var providerUserProfile = {
      // firstName: '',
      // lastName: '',
      displayName: profile.displayName,
      email: profile.email,
      username: profile.username,
      profileImageURL: (providerData.logo) ? providerData.logo : undefined,
      provider: 'twitch',
      providerIdentifierField: 'id',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
