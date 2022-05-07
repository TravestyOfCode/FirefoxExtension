/**
 *   CSS to hide everything on the page except for
 *   elements that have the "beastify-image" class.
 **/

const hidePage = `body > not:(.beastify-image) { display: none; }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script on the page.
 **/
function listenForClicks() {
    document.addEventListener("click", (e) => {
        // Given the name of the beast, get the url to the corresponding image
        function beastNameToURL(beastName) {
            switch (beastName) {
                case "Frog":
                    return browser.runtime.getURL("beasts/frog.jpg");
                case "Snake":
                    return browser.runtime.getURL("beasts/snake.jpg");
                case "Turtle":
                    return browser.runtime.getURL("beasts/turtle.jpg");
            }
        }

        /** 
         *  Insert the page-hiding CSS into the active tab,
         *  then get the beast URL and send a 'beastify'
         *  message to the content script of the active tab.
         **/
        function beastify(tabs) {
            browser.tabs.intertCSS({ code: hidePage }).then(() => {
                let url = beastNameToURL(e.target.textContext);
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "beastify",
                    beastURL: url
                });
            });
        }

        /**
         * Remove the page-hiding CSS from the active tab and
         * send a "reset" message to the content script.
         **/
        function reset(tabs) {
            browser.tabs.removeCSS({ code: hidePage }).then(() => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "reset"
                });
            });
        }

        /**
         * Log the error to the console
         **/
        function reportError(error) {
            console.error(`Could not beastify: $(error)`);
        }

        /**
         * Get the active tab, then call beastify or reset as needed
         **/
        if (e.target.classList.contains("beast")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(beastify)
                .catch(reportError);
        }
    });
}

/**
 * There was an error executing the script. Display the error message, hide the normal UI
 **/
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: 
    ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we can't inject the script, handle the error
 **/
browser.tabs.executeScript({ file: "/content_scripts/beastify.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
