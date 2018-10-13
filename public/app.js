window.addEventListener('load', function() {
  var content = document.querySelector('.content');
  var loadingSpinner = document.getElementById('loading');
  content.style.display = 'block';
  loadingSpinner.style.display = 'none';

  var webAuth = new window.auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    audience: API_AUDIENCE,
    responseType: "token id_token",
    scope: "openid"
  })

  var loginStatus = document.querySelector('.container h4');

  // buttons and event listeners
  var loginBtn = document.getElementById('qsLoginBtn');
  var logoutBtn = document.getElementById('qsLogoutBtn');

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

  logoutBtn.addEventListener('click', logout);

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function getCustomers(accessToken) {
    const ENDPOINT = API_AUDIENCE;  

    fetch(ENDPOINT, { headers: { Authorization: "Bearer " + accessToken } })
      .then(handleSuccess)
      .catch(handleError)

    function handleSuccess(response) {
      //var customers = response.json();
      console.log(`Access token: ${accessToken}`);
      console.log(response.body);
    }

    function handleError(err) {
      console.log(err)
    }
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    location.href = `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${AUTH0_CALLBACK_URL_ENCODED}`;
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        loginBtn.style.display = "none";

        console.log(authResult);
        setSession(authResult);
        getCustomers(authResult.accessToken);
      } else if (err) {
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
      displayButtons();
    });
  }

  function displayButtons() {
    if (isAuthenticated()) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      loginStatus.innerHTML = 'You are logged in!';
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      loginStatus.innerHTML =
        'You are not logged in! Please log in to continue.';
    }
  }

  handleAuthentication();
});
