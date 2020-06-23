var active_configurations = [];
var email = undefined;
var previousTabsUrls = [];
var focus_group = "";
var lock_user = false;
var lastMessageTime = 0;
var request_pending = false;
var updater_pending = false;
var classwize_event_url = undefined;
var lock_url = undefined;

var is_active = function (configuration) {
  var now = Math.floor(Date.now() / 1000);
  if (configuration.timeout !== 0 && configuration.timeout > now) {
    return true;
  }

  for (var period of configuration.periods) {
    var dateTime = new Date();
    var dayOfWeek = dateTime.getDay();
    var time = parseInt(dateTime.getHours() + "" + dateTime.getMinutes());
    if (dayOfWeek === 0 && period.day === "sun") {
      if (time >= period.startTime && time <= period.endTime) {
        return true;
      }
    }
    if (dayOfWeek === 1 && period.day === "mon") {
      if (time >= period.startTime && time <= period.endTime) {
        return true;
      }
    }
    if (dayOfWeek === 2 && period.day === "tue") {
      if (time >= period.startTime && time <= period.endTime) {
        return true;
      }
    }
    if (dayOfWeek === 3 && period.day === "wed") {
      if (time >= period.startTime && time <= period.endTime) {
        return true;
      }
    }
    if (dayOfWeek === 4 && period.day === "thur") {
      if (time >= period.startTime && time <= period.endTime) {
        return true;
      }
    }
    if (dayOfWeek === 5 && period.day === "fri") {
      if (time >= period.startTime && time <= period.endTime) {
        return true;
      }
    }
    if (dayOfWeek === 6 && period.day === "sat") {
      if (time >= period.startTime && time <= period.endTime) {
        return true;
      }
    }
  }

  return false;
};

var logging__error = function (message) {
  console.error("[linewize::window] " + message);
};

var logging__message = function (message) {
  console.log("[linewize::window] " + message);
};

var add_message_container = function () {
  chrome.tabs.executeScript(null, {
    code:
      "" +
      '    if (document.getElementById("linewize-message-container") == null) {\n' +
      "        var messageContainer = document.createElement('div');\n" +
      '        messageContainer.style = "position: fixed;" +\n' +
      '            "width: 100%;" +\n' +
      '            "z-index: 999999999999;" +\n' +
      '            "overflow-x: hidden;" +\n' +
      '            "text-align: center;" +\n' +
      '            "top: 0;" +\n' +
      '            "min-height: unset;" +\n' +
      '            "height: unset;" +\n' +
      '            "font-family: unset;"\n' +
      '        messageContainer.id = "linewize-message-container";\n' +
      "        document.body.appendChild(messageContainer);\n" +
      "    }",
  });
};

var add_fade_functions = function () {
  chrome.tabs.executeScript(null, {
    code:
      "    var fadeInSide = function (divElement) {\n" +
      "        setTimeout(function () {\n" +
      '            divElement.style.marginLeft = "0";\n' +
      '            divElement.style.opacity = "0.8";\n' +
      "        }, 500);\n" +
      "    };\n" +
      "    var fadeOutSide = function (divElement) {\n" +
      '        divElement.addEventListener("transitionend", event => {\n' +
      "            divElement.remove()\n" +
      "        }, false);\n" +
      '        divElement.style.marginLeft = "100%";\n' +
      '        divElement.style.opacity = "0";\n' +
      "    };",
  });
};

var print_message = function (message, timestamp) {
  logging__message("[Message] Received");
  message = message.split("\n").join("&#xA;");
  add_message_container();
  add_fade_functions();
  chrome.tabs.executeScript(null, {
    code:
      'if (document.getElementById("linewize-message-container") != null) {\n' +
      '        let message_container = document.getElementById("linewize-message-container");\n' +
      '        let divElement = document.createElement("div");\n' +
      '        let messageElementId = "message-' +
      timestamp +
      '";\n' +
      "        let messageDuration = 300000;\n" +
      "\n" +
      "        divElement.id = messageElementId;\n" +
      '        divElement.className = "message-element";\n' +
      '        divElement.style = "width:100%;" +\n' +
      '            "               padding:20px;" +\n' +
      '            "               color:#FFF;" +\n' +
      '            "               opacity:0.0;" +\n' +
      '            "               margin-top:0px;" +\n' +
      '            "               margin-left:-100%;" +\n' +
      '            "               min-height: unset;" +\n' +
      '            "               height: unset;" +\n' +
      '            "               font-family: unset;" +\n' +
      '            "               background:#000;";\n' +
      '        divElement.style.transition = "opacity 1s, margin-left 1s ease-in-out";\n' +
      '        let timeElement = document.createElement("div");\n' +
      '        timeElement.style = "float:left; margin-left: 10px;";\n' +
      "        let messageDate = new Date(" +
      timestamp +
      "*1000);\n" +
      '        let messageAmPm = messageDate.getHours() >= 12 ? "pm" : "am";\n' +
      '        timeElement.innerHTML += (messageDate.getHours() % 12 == 0 ? 12 : messageDate.getHours() % 12) + ":" + ' +
      '                                   (messageDate.getMinutes() < 10 ? "0" + messageDate.getMinutes() : messageDate.getMinutes()) + messageAmPm;\n' +
      "        divElement.appendChild(timeElement);\n" +
      "\n" +
      '        let messageElement = document.createElement("span");\n' +
      '        messageElement.style = "word-wrap: break-word; width: calc(100% - 150px);display:inline-block;white-space:pre-wrap";\n' +
      '        messageElement.innerHTML += "' +
      message +
      '";\n' +
      "        divElement.appendChild(messageElement);\n" +
      "\n" +
      '        let closeElement = document.createElement("div");\n' +
      "        closeElement.onclick = function(){divElement.remove()};\n" +
      '        closeElement.style = "float:right; margin-right: 40px; cursor: pointer";\n' +
      '        closeElement.innerHTML += "x";\n' +
      "        divElement.appendChild(closeElement);\n" +
      "        message_container.appendChild(divElement);\n" +
      "        fadeInSide(divElement);\n" +
      "        setTimeout(function() {\n" +
      "            fadeOutSide(divElement)\n" +
      "        }, messageDuration);\n" +
      "    }",
  });
};

var retrieve_configuration = function () {
  if (request_pending) {
    return;
  }
  logging__message("[Config] Retrieving Config Update");
  chrome.identity.getProfileUserInfo(function (userinfo) {
    // userinfo = { "email": "student1" };
    if (
      userinfo != undefined &&
      userinfo.email != undefined &&
      userinfo.email != ""
    ) {
      if (email !== userinfo.email) {
        logging__message("[Profile] Found Google Identity: " + userinfo.email);
      }
      email = userinfo.email;

      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "http://chromewindows.linewize.net?email=" + userinfo.email,
        true
      );
      // xhr.open("GET", "https://configuration-gw.us-1.linewize.net/get/configuration/window/v2?email=charlotte.belt&deviceid=bridge.demo1.linewize&last=" + lastMessageTime, true);
      // xhr.open("GET", "https://configuration-gw.beta-1.linewize.net/get/configuration/window/v2?email=nick.scott@linewize.com&deviceid=linewize.developer.device&last=" + lastMessageTime, true);
      // xhr.open("GET", "http://localhost:5016/get/configuration/window/v2?deviceid=newTestDevice&email=student1&last=" + lastMessageTime, true);
      xhr.onreadystatechange = function () {
        request_pending = false;
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            active_configurations.length = 0;
            var dict_response = JSON.parse(xhr.responseText);
            var configurations = dict_response["configurations"];
            classwize_event_url = dict_response["event_service_url"];
            updater.poll();
            lock_url = dict_response["lock_url"];
            for (i in configurations) {
              active_configurations.push(configurations[i]);
            }
            focus_tabs();
          } else {
            logging__error(
              "failed to retrieve configuration from the cfg-gateway, error was " +
                xhr.responseText
            );
            active_configurations.length = 0;
          }
        }
      };
      request_pending = true;
      xhr.send();
    } else {
      logging__error("failed to resolve identity");
    }
  });
};

var capture_active_tab = function (callback) {
  chrome.tabs.captureVisibleTab(
    null,
    { format: "jpeg", quality: 50 },
    function (img) {
      var sourceImage = new Image();
      var width = 300;
      sourceImage.onload = function () {
        if (sourceImage.width > width) {
          var oc = document.createElement("canvas"),
            octx = oc.getContext("2d");
          oc.width = sourceImage.width;
          oc.height = sourceImage.height;
          octx.drawImage(sourceImage, 0, 0);
          while (oc.width * 0.5 > width) {
            oc.width *= 0.5;
            oc.height *= 0.5;
            octx.drawImage(oc, 0, 0, oc.width, oc.height);
          }
          oc.width = width;
          oc.height = (oc.width * sourceImage.height) / sourceImage.width;
          octx.drawImage(sourceImage, 0, 0, oc.width, oc.height);
          callback(oc.toDataURL());
        } else {
          callback(sourceImage.src);
        }
      };
      sourceImage.src = img;
    }
  );
};

var capture_tab_and_send = function () {
  if (active_configurations.length === 0) {
    return;
  }

  var segment = {
    title: "",
    url: "",
    favicon: "",
    tab_id: "",
    action: "",
    screenshot: "",
  };

  chrome.tabs.query({ currentWindow: true, active: true }, function (allTabs) {
    for (var i = 0; i < allTabs.length; i++) {
      var tab = allTabs[i];
      segment["tab_id"] = tab["windowId"] + "_" + tab["id"];
      segment["action"] = "upsert";
      segment["title"] = tab["title"];
      segment["url"] = tab["url"];
      segment["favicon"] = tab["favIconUrl"];
    }

    capture_active_tab(function (img) {
      segment["screenshot"] = img;
      sendToLinewize();
    });

    function sendToLinewize() {
      for (let configuration of active_configurations) {
        if (is_active(configuration)) {
          segment["email"] = configuration["identity"];

          var xhr = new XMLHttpRequest();
          xhr.open("POST", configuration["endpoint"], true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(JSON.stringify(segment));
        }
      }
    }
  });
};

var tab_removed = function (tabId) {
  for (let configuration of active_configurations) {
    if (is_active(configuration)) {
      var segment = {
        email: configuration["identity"],
        tab_id: tabId,
        action: "remove",
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", configuration["endpoint"], true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(segment));
    }
  }
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo["status"] === "complete") {
    add_message_container();
    capture_tab_and_send();
  }
});

chrome.tabs.onActivated.addListener(function (tabId, changeInfo, tab) {
  capture_tab_and_send();
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  tab_removed(removeInfo["windowId"] + "_" + tabId);
});

chrome.extension.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request.greeting === "GetStatus") {
    if (active_configurations.length > 0) {
      for (let configuration of active_configurations) {
        if (is_active(configuration)) {
          sendResponse({ status: "ACTIVE", user: configuration["identity"] });
          return;
        }
      }
    }

    sendResponse({ status: "INACTIVE", user: email });
  }
});

focus_tabs = () => {
  if (active_configurations.length === 0) {
    if (previousTabsUrls.length > 0) {
      restore_tabs();
      logging__message("[Focus] deactivated, restoring previous tabs");
    }
    return;
  }

  for (let configuration of active_configurations) {
    if (is_active(configuration)) {
      // Focus handling
      if (
        configuration.apply_focus &&
        configuration.focus_urls &&
        configuration.focus_urls.length > 0
      ) {
        // focus urls available so we must be in focus mode
        if (focus_group.length === 0) {
          logging__message("[Focus] activated");

          // no focus for a group configured yet, lets do it
          focus_group = configuration.group;
          restrict_tabs(configuration.focus_urls);
          add_tabs(configuration.focus_urls);
          setTimeout(prevent_new_tab, 1000);
          break;
        } else if (focus_group === configuration.group) {
          // potentially update focus urls
          allow_new_tabs();
          setTimeout(() => {
            add_tabs(configuration.focus_urls);
            restrict_tabs(configuration.focus_urls);
            setTimeout(prevent_new_tab, 1000);
          }, 1000);
          break;
        }
      } else {
        if (focus_group.length > 0 && focus_group === configuration.group) {
          logging__message("[Focus] deactivated, restoring previous tabs");
          // reset after group came out of focus
          focus_group = "";
          allow_new_tabs();
          restore_tabs();
          break;
        }
      }
      // Lock handling
      if (lock_url !== undefined && configuration.locked_users) {
        if (configuration.locked_users.length > 0) {
          if (
            !lock_user &&
            configuration.locked_users.indexOf(configuration.identity) >= 0
          ) {
            logging__message("[Lock] activated");
            lock_user = true;
            restrict_tabs([lock_url]);
            add_tabs([lock_url]);
            setTimeout(prevent_new_tab, 1000);
            setTimeout(prevent_navigation, 1000);
          } else if (
            lock_user &&
            configuration.locked_users.indexOf(configuration.identity) < 0
          ) {
            logging__message("[Lock] deactivated");
            lock_user = false;
            allow_new_tabs();
            cleanup_tabs([lock_url]);
            allow_navigation();
            restore_tabs();
          }
        } else if (lock_user) {
          logging__message("[Lock] deactivated");
          lock_user = false;
          allow_new_tabs();
          cleanup_tabs([lock_url]);
          allow_navigation();
          restore_tabs();
        }
      }
    }
  }
};

cleanup_tabs = (unwanted_urls) => {
  chrome.tabs.query({}, (tabs) => {
    tabLoop: for (let tab of tabs) {
      for (let url of unwanted_urls) {
        if (tab.url.indexOf(url) >= 0) {
          chrome.tabs.remove(tab.id);
        }
      }
    }
  });
};

restrict_tabs = (allowed_urls) => {
  chrome.tabs.query({}, (tabs) => {
    tabLoop: for (let tab of tabs) {
      for (let url of allowed_urls) {
        if (tab.url.indexOf(url) >= 0) {
          // this tab url is part of the focus - don't remove it
          continue tabLoop;
        }
      }
      previousTabsUrls.push(tab.url);
      chrome.tabs.remove(tab.id);
    }
  });
};

add_tabs = (urls) => {
  chrome.tabs.query({}, (tabs) => {
    urlLoop: for (let url of urls) {
      for (let tab of tabs) {
        if (tab.url.indexOf(url) >= 0) {
          // this tab url is part of the focus - no need to add it again
          continue urlLoop;
        }
      }
      let protocol = "";
      if (url.indexOf("http") !== 0) {
        protocol = "http://";
      }
      chrome.tabs.create({ url: protocol + url });
    }
  });
};

restore_tabs = () => {
  for (let url of previousTabsUrls) {
    chrome.tabs.create({ url: url });
  }
  previousTabsUrls.length = 0;
};

remove_new_tab_handler = (tab) => {
  chrome.tabs.query({}, (tabs) => {
    if (tabs.length <= 1) {
      return;
    }
    chrome.tabs.remove(tab.id);
  });
};

prevent_navigation_handler = (details) => {
  if (details.url.indexOf("linewize.net") >= 0) {
    return {};
  }
  return { redirectUrl: lock_url };
};

prevent_navigation = () => {
  if (
    !chrome.webRequest.onBeforeRequest.hasListener(prevent_navigation_handler)
  ) {
    chrome.webRequest.onBeforeRequest.addListener(
      prevent_navigation_handler,
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  }
};

allow_navigation = () => {
  if (
    chrome.webRequest.onBeforeRequest.hasListener(prevent_navigation_handler)
  ) {
    chrome.webRequest.onBeforeRequest.removeListener(
      prevent_navigation_handler
    );
  }
};

prevent_new_tab = () => {
  if (!chrome.tabs.onCreated.hasListener(remove_new_tab_handler)) {
    chrome.tabs.onCreated.addListener(remove_new_tab_handler);
  }
};

allow_new_tabs = () => {
  if (chrome.tabs.onCreated.hasListener(remove_new_tab_handler)) {
    chrome.tabs.onCreated.removeListener(remove_new_tab_handler);
  }
};

setInterval(function () {
  retrieve_configuration();
}, 60000);

var updater = {
  errorSleepTime: 500,
  cursor: null,

  poll: function () {
    if (updater_pending) {
      return;
    }
    chrome.identity.getProfileUserInfo(function (userinfo) {
      if (
        userinfo !== undefined &&
        userinfo.email !== undefined &&
        userinfo.email !== ""
      ) {
        console.log("poll");
        let url = classwize_event_url;
        var xhr = new XMLHttpRequest();
        xhr.timeout = 0;
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              updater_pending = false;
              updater.onSuccess(xhr.responseText);
            } else {
              updater_pending = false;
              updater.onError(xhr.responseText);
            }
          }
        };
        updater_pending = true;
        xhr.open("POST", url, true);
        xhr.send();
      } else {
        logging__error("failed to resolve identity");
      }
    });
  },

  onSuccess: function (responseText) {
    try {
      updater.newMessages(responseText);
    } catch (e) {
      updater.onError();
      return;
    }
    updater.errorSleepTime = 500;
    window.setTimeout(updater.poll, 0);
  },

  onError: function (response) {
    console.log(response);
    updater.errorSleepTime *= 2;
    if (updater.errorSleepTime > 5000) {
      updater.errorSleepTime = 5000;
    }
    console.log("Poll error; sleeping for", updater.errorSleepTime, "ms");
    window.setTimeout(updater.poll, updater.errorSleepTime);
  },
  newMessages: function (response) {
    let jsonMessage = JSON.parse(response);
    if (!jsonMessage.messages) return;
    let messages = jsonMessage.messages;
    console.log(messages.length, "new messages");
    for (let i = 0; i < messages.length; i++) {
      console.log(messages[i].value);
      if (messages[i].event.toLowerCase() === "message") {
        print_message(
          messages[i].value,
          parseFloat(messages[i].timestamp.split(".")[0])
        );
      } else if (messages[i].event.toLowerCase() === "open_tab") {
        chrome.tabs.create({ url: messages[i].value });
      }
    }
  },
};

retrieve_configuration();
