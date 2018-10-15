window.addEventListener("load", function() {
  var content = document.querySelector(".content")
  var loadingPage = document.getElementById("loadingPage")
  var loadingDiv = document.getElementById("loadingDiv")
  var alert = document.getElementById("alert")
  var alertHeading = document.querySelector(".alert-heading")
  var alertMessage = document.querySelector(".alert-msg")
  var loginStatus = document.querySelector("#main-view h4")
  var message = document.querySelector(".main-view p")
  var loginBtn = document.getElementById("btnLogin")
  var logoutBtn = document.getElementById("btnLogout")

  content.style.display = "block"
  loadingPage.style.display = "none"
  alert.style.display = "none"

  var webAuth = new window.auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    audience: API_AUDIENCE,
    responseType: "token id_token",
    scope: "openid profile"
  })

  loginBtn.addEventListener("click", function(e) {
    // Initiate Auth0 login
    e.preventDefault()
    webAuth.authorize()
  })

  logoutBtn.addEventListener("click", logout)

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )

    // Store entries from authResult into localStorage
    localStorage.setItem("access_token", authResult.accessToken)
    localStorage.setItem("id_token", authResult.idToken)
    localStorage.setItem("expires_at", expiresAt)
  }

  function getCustomers(accessToken) {
    if (!accessToken) return
    console.log(`access_token: ${accessToken}`)

    // Fetch the customers data from the API
    fetch(`${API_AUDIENCE}/customers`, {
      headers: { Authorization: "Bearer " + accessToken }
    })
      .then(res => res.json())
      .then(response => {
        console.log("Success:", JSON.stringify(response))
        loadingDiv.style.display = "none"

        // Display data in jQuery DataTable
        $("#tblCustomers").DataTable({
          data: response,
          paging: false,
          info: false,
          columns: [
            { data: "id", title: "ID" },
            { data: "avatar", title: "Avatar" },
            { data: "name", title: "Name" },
            { data: "position", title: "Position" },
            { data: "company", title: "Company" },
            { data: "status", title: "Status" }
          ],
          columnDefs: [
            {
              targets: 1,
              render: function(data) {
                return '<img class="avatar" src="' + data + '">'
              }
            }
          ],
          dom: "Bfrtip",
          buttons: [
            {
              text: "All",
              action: function(e, dt, node, config) {
                dt.search("")
                  .columns(5)
                  .search("")
                  .draw()
              }
            },
            {
              text: "Hot",
              action: function(e, dt, node, config) {
                dt.columns(5)
                  .search("Hot")
                  .draw()
              }
            },
            {
              text: "Cool",
              action: function(e, dt, node, config) {
                dt.columns(5)
                  .search("Cool")
                  .draw()
              }
            }
          ]
        })
      })
      .catch(error => console.error("Error:", error))
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem("access_token")
    localStorage.removeItem("id_token")
    localStorage.removeItem("expires_at")

    // Initiate Auth0 logout
    location.href = `https://${AUTH0_DOMAIN}/v2/logout?returnTo=${AUTH0_CALLBACK_URL_ENCODED}`
  }

  function isAuthenticated() {
    // Check whether the current time is past the access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem("expires_at"))
    return new Date().getTime() < expiresAt
  }

  function handleAuthentication() {
    // Initiate Auth0 hash parsing
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log("Auth Result: " + JSON.stringify(authResult))
        setSession(authResult)
        getCustomers(authResult.accessToken)
        toggleView(
          true,
          "You are granted the <i>sales</i> role, thus you may view the list of customers below."
        )
      } else if (isAuthenticated()) {
        let accessToken = localStorage.getItem("access_token")
        getCustomers(accessToken)
        toggleView(
          true,
          "You are granted the <i>sales</i> role, thus you may view the list of customers below."
        )
      } else if (err) {
        console.log(err)
        loadingDiv.style.display = "none"
        toggleView(
          true,
          "You are granted the <i>general</i> role, thus you are prohibited to view the list of customers."
        )
        alert.style.display = "block"
        alertHeading.innerHTML = `Error: ${err.error}`
        alertMessage.innerHTML = err.errorDescription
      } else {
        loadingDiv.style.display = "none"
        toggleView(false)
      }
    })
  }

  function toggleView(isLoggedIn, messageText) {
    // Toggle UI controls based on login status
    if (isLoggedIn) {
      loginBtn.style.display = "none"
      logoutBtn.style.display = "inline-block"
      loginStatus.innerHTML = "You are logged in!"
      message.innerHTML = messageText
    } else {
      loginBtn.style.display = "inline-block"
      logoutBtn.style.display = "none"
      loginStatus.innerHTML =
        "You are not logged in! Please log in to continue."
    }
  }

  handleAuthentication()
})
