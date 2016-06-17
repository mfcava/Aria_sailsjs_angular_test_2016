
/**
 * waterlock
 *
 * defines various options used by waterlock
 * for more informaiton checkout
 *
 * http://waterlock.ninja/documentation
 */
module.exports.waterlock = {

  // Base URL
  //
  // used by auth methods for callback URI's using oauth and for password
  // reset links.
  baseUrl: 'http://swift-baby-178249.nitrousapp.com:3000',

  // Auth Method(s)
  //
  // this can be a single string, an object, or an array of objects for your
  // chosen auth method(s) you will need to see the individual module's README
  // file for more information on the attributes necessary. This is an example
  // of the local authentication method with password reset tokens disabled.
  authMethod: [
    {
      name:'waterlock-local-auth',
      passwordReset:{
        tokens: false,
        mail: {
          protocol: 'SMTP',
          options:{
            service: 'Gmail',
            auth: {
              user: 'risingfenix@gmail.com',
              pass: 'P1c14nP4ss!'
            }
          },
          from: 'no-reply@domain.com',
          subject: 'Your password reset!',
          forwardUrl: 'http://swift-baby-178249.nitrousapp.com:3000'
        },
        template:{
          file: '../views/email.jade',
          vars:{}
        }
      },
      createOnNotFound: true
    }
  ],

  // JSON Web Tokens
  //
  // this provides waterlock with basic information to build your tokens,
  // these tokens are used for authentication, password reset,
  // and anything else you can imagine
  jsonWebTokens:{

    // CHANGE THIS SECRET
    secret: 'got_random_secret_code_854305123',
    expiry:{
      unit: 'days',
      length: '7'
    },
    audience: 'Cacye Accademy',
    subject: 'Marketing for Millenials',

    // tracks jwt usage if set to true
    trackUsage: false,

    // if set to false will authenticate the
    // express session object and attach the
    // user to it during the hasJsonWebToken
    // middleware
    stateless: true,

    // set the name of the jwt token property
    // in the JSON response
    tokenProperty: 'access_token',

    // set the name of the expires property
    // in the JSON response
    expiresProperty: 'expires',

    // configure whether or not to include
    // the user in the respnse - this is useful if
    // JWT is the default response for succesfull login
    includeUserInJwtResponse: true
  },

  // Post Actions
  //
  // Lets waterlock know how to handle different login/logout
  // attempt outcomes.
  postActions:{

    // post login event
    login: {

      // This can be any one of the following
      //
      // url - 'http://example.com'
      // relativePath - '/blog/post'
      // obj - {controller: 'blog', action: 'post'}
      // string - 'custom json response string'
      // default - 'default'
      success: 'jwt',

      // This can be any one of the following
      //
      // url - 'http://example.com'
      // relativePath - '/blog/post'
      // obj - {controller: 'blog', action: 'post'}
      // string - 'custom json response string'
      // default - 'default'
      failure: 'default'
    },

    //post logout event
    logout: {

      // This can be any one of the following
      //
      // url - 'http://example.com'
      // relativePath - '/blog/post'
      // obj - {controller: 'blog', action: 'post'}
      // string - 'custom json response string'
      // default - 'default'
      success: 'default',

      // This can be any one of the following
      //
      // url - 'http://example.com'
      // relativePath - '/blog/post'
      // obj - {controller: 'blog', action: 'post'}
      // string - 'custom json response string'
      // default - 'default'
      failure: 'default'
    },
    // post register event
   register: {
     // This can be any one of the following
     //
     // url - 'http://example.com'
     // relativePath - '/blog/post'
     // obj - {controller: 'blog', action: 'post'}
     // string - 'custom json response string'
     // default - 'default'
     success: 'default',
     // This can be any one of the following
     //
     // url - 'http://example.com'
     // relativePath - '/blog/post'
     // obj - {controller: 'blog', action: 'post'}
     // string - 'custom json response string'
     // default - 'default'
     failure: 'default'
   }
  }
};
