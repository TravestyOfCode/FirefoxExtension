(function () {
    /** Check/set global guard variable so it won't
     * do anything if it gets injected a second time.
     **/

    if (window.hasRun) {
        return;
    }

    window.hasRun = true;

    /** Given an url to a beast image, remove all existing beasts
     * then create and style an IMG node pointing to that image and
     * insert the node into the document.
     **/

    function insertBeast(beastURL) {
        removeExisitingBeasts();
        let beastImage = document.createElement("img");
        beastImage.setAttribute("src", beastURL);
        beastImage.style.height = "100vh";
        beastImage.className = "beastify-image";
        document.body.appendChild(beastImage);
    }

    /** Remove every beast from the page **/
    function removeExistingBeasts() {
        let existingBeasts = document.querySelectorAll(".beastify-image");
        for (let beast of existingBeasts) {
            beast.remove();
        }
    }

    /** Listen for message from the background script
     * Call insertBeast() or removeExistingBeasts()
     **/
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "beastify") {
            insertBeast(message.beastURL);
        }
        else if (message.command === "reset") {
            removeExistingBeasts();
        }
    });


})();