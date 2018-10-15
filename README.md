# asolvi-customers-app
Web app to initiate <b>Auth0</b> login and view list of Asolvi dummy customers if permitted.

A working example of the web app can be found at https://asolvi-customers-app.herokuapp.com.

<b>Note:</b> For the sake of demonstrating access control via roles, any signups using the '<i>gmail.com</i>' domain 
will be assigned the <b>sales</b> role and will thus have access to view the list of customers. Other signups will 
be assigned the <b>general</b> role and will be prohibited from doing so.

For own usage, please ensure the entries in the <i>auth0-variable.js</i> file is modified according to your <b>Auth0</b> 
account.
The web app can be started using the command <i>npm start</i> or <i>node server.js</i>.
