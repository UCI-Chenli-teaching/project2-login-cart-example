## This example shows how to implement the login, session and form feature using the Microservices architecture design.

### To run this example:
1. clone this repository using `git clone https://github.com/UCI-Chenli-teaching/2019w-project2-login-cart-example.git`
2. open Eclipse -> File -> import -> under "Maven" -> "Existing Maven Projects" -> Click "Finish".
3. For "Root Directory", click "Browse" and select this repository's folder. Click "Finish".
4. You can run this project on Tomcat now. The default username is `anteater` and password is `123456` .

### Features
1. Login with the username and password provided above.
2. When you get into the welcome page, it shows your current session ID and the last access time. 
3. It also simulates a shopping cart feature. When you type items you want to store in this session and click `add`, it will list the items you have added. When you refresh the web page and add more items to the list, it will contain the all items that you have added to the list in this session. 

### Brief Explanation

`login.html` contains the login form, but the default form action is disabled. It also includes jQuery and `login.js`.


`login.js` handles submitting the form. 
  - In line `47`, it sets up an event listener for the form submit action and binds it to `submitLoginForm` function. 
  - In function `submitLoginForm`, it disables the default form action and then sends a HTTP POST request to the backend.
  - In function `handleLoginResult`, it parses the JSON data sent by the backend, and if login is successful, it redirects to the `index.html` page. It login fails, it shows the error message.


`LoginServlet.java` is the servlet which handles the login request. It contains the following steps 
  - It gets the username and password values from the parameters.
  - It verifies the username and password.
  - If login success, it puts the `User` object in the session. Then sends back a JSON response: `{"status": "success", "message": "success"}` .
  - If login fails, the JSON response will be: `{"status": "success", "message": "incorrect password"}`  or `{"status": "success", "message": "user <username> doesn't exist"}`.
   
 
 `LoginFilter.java` is a special `Filter` class. The purpose of this class is to implement: when requesting any url, if the user is not logged in, then it redirects to the `login.html` page. 
   - A `Filter` class intercepts all incoming requests and decides if this request is allowed according to certain rules. See a detailed about `Filter`in a tutorial here: http://tutorials.jenkov.com/java-servlets/servlet-filters.html
   - In `Filter`, all requests matched will pass through the `doFilter` function.
   - `LoginFilter` fist checks if the URL is allowed to access without logging in: `login.html`, `login.js`, and `api/login` (the url mapped to `LoginServlet.java`) are allowed.
   - Then it checks the session to see if the user has already logged in. If not, it redirects the request to `login.html`. Otherwise it continue to the original requested url.
  
  `IndexServlet.java` is a servlet for the page that shows your session id and last access time. It is used to hold the information of your session and the cart feature that is implemented down below that. It has two methods, `doPost` and `doGet`.
  * The `doPost` method will be invoked when you have HTTP Post request through the api `/api/index`, which lands on `index.html` through `index.js`.
    * It will first get the session ID, overwrite the last access time, and write those values in the JSON Object that is sent through `response`. 
    * Next, in the `index.js`, it will show the content in the response by ajax call through jQuery, which appears in the `index.html`.
  * The `doGet` method is invoked with HTTP Get request and it is responsible for the item cart feature.    
    * Also, it gets the session ID and the current item list from that session.
    * If there is no such array of items, create one and add the current input item
    * Otherwise, add to the array and send through `index.js`  