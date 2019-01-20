$.ajax({
    type: "POST",
    url: "api/index",
    success: (resultDataString) => {
        resultDataJson = JSON.parse(resultDataString);
        $("#sessionID").text("Session ID: " + resultDataJson["sessionID"]);
        $("#lastAccessTime").text("Last access time: " + resultDataJson["lastAccessTime"]);
    }
});

jQuery("#cart").submit((event) => {
    event.preventDefault();
    jQuery.get(
        "api/index",
        jQuery("#cart").serialize(),
        (resultDataString) => {
            var resultArray = resultDataString.split(",");
            var res = "<ul>";
            for(let i = 0; i < resultArray.length; i++) {
                res += "<li>" + resultArray[i] + "</li>";
            }
            res += "</ul>";
            $("#item_list").html("");
            $("#item_list").append(res);
        }
    );
});