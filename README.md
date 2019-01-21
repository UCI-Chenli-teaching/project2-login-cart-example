## This example shows how to implement the login, session and form feature using the Microservices architecture design.

### To run this example:
1. Clone this repository using `git clone https://github.com/UCI-Chenli-teaching/2019w-project2-login-cart-example.git`
2. Open Eclipse -> File -> import -> under "Maven" -> "Existing Maven Projects" -> Click "Finish".
3. For "Root Directory", click "Browse" and select this repository's folder. Click "Finish".
4. You can run this project on Tomcat now. The default username is `anteater` and password is `123456` .

### Features
1. This example application allows you to login with the username and password provided above.
2. When you land on the welcome page, it will show your current session ID and last access time. 
3. It also simulates a shopping cart feature. When you type in items that you want to store in the current seesion and then click `add`, the web page will show the a list of items that consist of your previous items and the one you just added. When you refresh the page and add more items, the list that the web page shows will contain the all items that you have added to the list in this session. 

### Brief Explanation

`login.html` contains the login form. In the `form` tag with `id=login_form`, the action is disabled so that we can implement our own logic with the `submit` event. It also includes jQuery and `login.js`.


`login.js` is responsible for submitting the form. 
  - In line `47`, it sets up an event listener for the form `submit` action and binds the action to the `submitLoginForm` function. 
  - The `submitLoginForm` function disables the default form action and sends HTTP POST requests to the backend.
  - The `handleLoginResult` function parses the JSON data that is sent from the backend. If login is successful, `login.js` redirects to the `index.html` page. If login fails, it shows appropriate error messages.


`LoginServlet.java` handles the login requests. It contains the following functionalities:
  - It gets the username and password from the parameters.
  - It verifies the username and password.
  - If login succeeds, it puts the `User` object in the session. Then it sends back a JSON response: `{"status": "success", "message": "success"}` .
  - If login fails, the JSON response will be: `{"status": "success", "message": "incorrect password"}` or `{"status": "success", "message": "user <username> doesn't exist"}`.
   
 
 `LoginFilter.java` is a special `Filter` class. It serves the purpose that for each URL request, if the user is not logged in, then it redirects the user to the `login.html` page. 
   - A `Filter` class intercepts all incoming requests and determines if such requests are allowed against the rules we implement. See more details about `Filter` class [here](http://tutorials.jenkov.com/java-servlets/servlet-filters.html).
   - In `Filter`, all requests will pass through the `doFilter` function.
   - `LoginFilter` first checks if the request is `login.html`, `login.js`, or `api/login`, which are the URL patterns we mapped to `LoginServlet.java` that are allowed to access without login.
   - It then checks if the user has logged in to the current session. If so, it redirects the user to the requested URL and if otherwise,`login.html` .
  
  `IndexServlet.java` enables you to see your current session information, last access time and a list of items that you added through a `form` in that session. The `IndexServlet.java` has two methods, `doPost` and `doGet`.
  * The `doPost` method is invoked when you have HTTP Post requests through the api `/api/index`, which lands on `index.html` through `index.js`.
    * It first gets the session ID, overrides the last access time, and writes these values in the JSON Object that is sent through `response`. 
    * Next, `index.js` shows the content in the response by an `ajax` call through `jQuery`, which appears in the `index.html`.
  * The `doGet` method is invoked with HTTP Get requests, and it is responsible for the item cart feature.    
    * First, it gets the session ID and the list of items from current session.
    * If there is no such array of items, it will create an empty array and add the item that the user had typed in.
    * Otherwise, it creates an array and sends the list of items through `index.js`.