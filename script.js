/* =========================================================
   HOMEPAGE TOOLBOX 360 VIEWER
========================================================= */

const homeViewer = document.getElementById("homeViewer");

if (homeViewer) {

    const homeImages = [
        "images/toolbox/360/pano-01.png",
        "images/toolbox/360/pano-02.png",
        "images/toolbox/360/pano-03.png",
        "images/toolbox/360/pano-04.png",
        "images/toolbox/360/pano-05.png",
        "images/toolbox/360/pano-06.png",
        "images/toolbox/360/pano-07.png",
        "images/toolbox/360/pano-08.png",
        "images/toolbox/360/pano-09.png",
        "images/toolbox/360/pano-10.png"
    ];

    let homeFrame = 0;
    let homeDragging = false;
    let homeStartX = 0;

    function showHomeFrame(frame) {
        homeFrame =
            (frame + homeImages.length) % homeImages.length;

        homeViewer.src = homeImages[homeFrame];
    }

    homeViewer.addEventListener("pointerdown", (event) => {
        homeDragging = true;
        homeStartX = event.clientX;

        homeViewer.setPointerCapture(event.pointerId);
        homeViewer.style.cursor = "grabbing";
    });

    homeViewer.addEventListener("pointermove", (event) => {

        if (!homeDragging) return;

        const movement = event.clientX - homeStartX;

        if (Math.abs(movement) >= 12) {

            if (movement > 0) {
                showHomeFrame(homeFrame - 1);
            } else {
                showHomeFrame(homeFrame + 1);
            }

            homeStartX = event.clientX;
        }
    });

    homeViewer.addEventListener("pointerup", () => {
        homeDragging = false;
        homeViewer.style.cursor = "grab";
    });

    homeViewer.addEventListener("pointercancel", () => {
        homeDragging = false;
        homeViewer.style.cursor = "grab";
    });

}