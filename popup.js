document.addEventListener("DOMContentLoaded", function () {
  chrome.extension.sendMessage({ greeting: "GetStatus" }, function (response) {
    document.getElementById("status").innerHTML = response["status"];

    if (response["status"] == "ACTIVE") {
      var message =
        "<div class='active'>Screenshots are being captured for " +
        response["user"] +
        "</div>";
      document.getElementById("status").innerHTML = message;
    } else {
      var message =
        "<div class='inactive'>Screenshots are <b>not</b> being captured for " +
        response["user"] +
        "</div>";
      document.getElementById("status").innerHTML = message;
    }
  });
});
