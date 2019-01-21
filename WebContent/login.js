/**
 * Handle the data returned by LoginServlet
 * @param resultDataString jsonObject
 */
function handleLoginResult(resultDataString) {
    resultDataJson = JSON.parse(resultDataString);

    console.log("handle login response");
    console.log(resultDataJson);
    console.log(resultDataJson["status"]);

    // If login succeeds, it will redirect the user to index.html
    if (resultDataJson["status"] === "success") {
        window.location.replace("index.html");
    }
    // If login fails, the web page will display error messages on <div> with id "login_error_message"
    else {
        console.log("show error message");
        console.log(resultDataJson["message"]);
        jQuery("#login_error_message").text(resultDataJson["message"]);
    }
}

/**
 * Submit the form content with POST method
 * @param formSubmitEvent
 */
function submitLoginForm(formSubmitEvent) {
    console.log("submit login form");
    /**
     * When users click the submit button, the browser will not direct
     * users to the url defined in HTML form. Instead, it will call this
     * event handler when the event is triggered.
     */
    formSubmitEvent.preventDefault();

    jQuery.post(
        "api/login",
        // Serialize the login form to the data sent by POST request
        jQuery("#login_form").serialize(),
        (resultDataString) => handleLoginResult(resultDataString)
    );

}

// Bind the submit action of the form to a handler function
jQuery("#login_form").submit((event) => submitLoginForm(event));

