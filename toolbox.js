/* =========================================================
   360 TOOLBOX VIEWER
========================================================= */

const viewer = document.getElementById("viewer");

const ctx = viewer.getContext("2d");

const viewerImages = [];

const TOTAL_360_IMAGES = 10;

let current360 = 0;

let isDragging = false;
let startX = 0;
let startFrame = 0;


/* ---------------------------------------------------------
   Resize canvas
--------------------------------------------------------- */

function resizeViewer() {

    const rect = viewer.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    viewer.width = rect.width * dpr;
    viewer.height = rect.height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    draw360();
}


/* ---------------------------------------------------------
   Load 360 images
--------------------------------------------------------- */

for (let i = 1; i <= TOTAL_360_IMAGES; i++) {

    const image = new Image();

    const number = String(i).padStart(2, "0");

    image.src =
        `images/toolbox/360/pano-${number}.png`;

    image.onload = function () {

        viewerImages[i - 1] = image;

        draw360();
    };

    viewerImages.push(image);
}


/* ---------------------------------------------------------
   Draw current frame
--------------------------------------------------------- */

function draw360() {

    const image = viewerImages[current360];

    if (!image || !image.complete) {
        return;
    }

    const rect = viewer.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
     * Contain the image without distortion.
     */

    const imageRatio =
        image.naturalWidth / image.naturalHeight;

    const canvasRatio =
        width / height;

    let drawWidth;
    let drawHeight;

    if (imageRatio > canvasRatio) {

        drawWidth = width * 0.92;

        drawHeight =
            drawWidth / imageRatio;

    } else {

        drawHeight = height * 0.92;

        drawWidth =
            drawHeight * imageRatio;
    }


    const x =
        (width - drawWidth) / 2;

    /*
     * IMPORTANT:
     *
     * The vertical position is intentionally centered.
     *
     * This prevents frame 01 from appearing higher/lower
     * than the other panorama frames.
     */

    const y =
        (height - drawHeight) / 2;


    ctx.drawImage(
        image,
        x,
        y,
        drawWidth,
        drawHeight
    );
}


/* ---------------------------------------------------------
   Mouse drag
--------------------------------------------------------- */

viewer.addEventListener(
    "mousedown",
    function (event) {

        isDragging = true;

        startX = event.clientX;

        startFrame = current360;
    }
);


window.addEventListener(
    "mousemove",
    function (event) {

        if (!isDragging) {
            return;
        }

        const difference =
            event.clientX - startX;

        const sensitivity = 7;

        const frameChange =
            Math.floor(
                difference / sensitivity
            );

        let newFrame =
            startFrame - frameChange;

        newFrame =
            ((newFrame % TOTAL_360_IMAGES)
                + TOTAL_360_IMAGES)
            % TOTAL_360_IMAGES;

        if (newFrame !== current360) {

            current360 = newFrame;

            update360Counter();

            draw360();
        }
    }
);


window.addEventListener(
    "mouseup",
    function () {

        isDragging = false;
    }
);


/* ---------------------------------------------------------
   Touch drag
--------------------------------------------------------- */

viewer.addEventListener(
    "touchstart",
    function (event) {

        isDragging = true;

        startX =
            event.touches[0].clientX;

        startFrame = current360;
    },
    { passive: true }
);


viewer.addEventListener(
    "touchmove",
    function (event) {

        if (!isDragging) {
            return;
        }

        const difference =
            event.touches[0].clientX - startX;

        const sensitivity = 7;

        const frameChange =
            Math.floor(
                difference / sensitivity
            );

        let newFrame =
            startFrame - frameChange;

        newFrame =
            ((newFrame % TOTAL_360_IMAGES)
                + TOTAL_360_IMAGES)
            % TOTAL_360_IMAGES;

        if (newFrame !== current360) {

            current360 = newFrame;

            update360Counter();

            draw360();
        }
    },
    { passive: true }
);


viewer.addEventListener(
    "touchend",
    function () {

        isDragging = false;
    }
);


/* ---------------------------------------------------------
   360 arrow buttons
--------------------------------------------------------- */

document
    .getElementById("prev360")
    .addEventListener(
        "click",
        function () {

            current360--;

            if (current360 < 0) {
                current360 =
                    TOTAL_360_IMAGES - 1;
            }

            update360Counter();

            draw360();
        }
    );


document
    .getElementById("next360")
    .addEventListener(
        "click",
        function () {

            current360++;

            if (
                current360 >=
                TOTAL_360_IMAGES
            ) {
                current360 = 0;
            }

            update360Counter();

            draw360();
        }
    );


function update360Counter() {

    const counter =
        document.querySelector(
            ".viewer-counter span"
        );

    counter.textContent =
        current360 + 1;
}


window.addEventListener(
    "resize",
    resizeViewer
);


/* =========================================================
   PHOTO GALLERY
========================================================= */

const galleryImages = [

    {
        src: "images/toolbox/gallery/toolbox-01.png",
        caption: "CUSTOM INTERIOR LAYOUT"
    },

    {
        src: "images/toolbox/gallery/toolbox-02.png",
        caption: "REMOVABLE TOOL TRAY AND DRILL BIT CASE"
    },

    {
        src: "images/toolbox/gallery/toolbox-03.png",
        caption: "LID-MOUNTED DESIGN TOOLS"
    },

    {
        src: "images/toolbox/gallery/toolbox-04.png",
        caption: "MODULAR STORAGE"
    },

    {
        src: "images/toolbox/gallery/toolbox-05.png",
        caption: "RETRACTABLE POWER CABLE"
    },

    {
        src: "images/toolbox/gallery/toolbox-06.png",
        caption: "ONBOARD LIGHTING AND POWER"
    },

    {
        src: "images/toolbox/gallery/toolbox-07.png",
        caption: "3D SCAN AND DESIGN INTEGRATION"
    }

];


let currentGallery = 0;


const galleryImage =
    document.getElementById(
        "galleryImage"
    );

const galleryCaption =
    document.getElementById(
        "galleryCaption"
    );

const galleryNumber =
    document.getElementById(
        "galleryNumber"
    );

const galleryTotal =
    document.getElementById(
        "galleryTotal"
    );


galleryTotal.textContent =
    String(galleryImages.length)
        .padStart(2, "0");


function showGalleryImage(index) {

    currentGallery = index;

    const item =
        galleryImages[currentGallery];


    galleryImage.style.opacity = "0";


    setTimeout(
        function () {

            galleryImage.src =
                item.src;

            galleryCaption.textContent =
                item.caption;

            galleryNumber.textContent =
                String(currentGallery + 1)
                    .padStart(2, "0");

            galleryImage.style.opacity = "1";

        },
        120
    );
}


/* Previous */

document
    .getElementById("galleryPrev")
    .addEventListener(
        "click",
        function () {

            currentGallery--;

            if (currentGallery < 0) {

                currentGallery =
                    galleryImages.length - 1;
            }

            showGalleryImage(
                currentGallery
            );
        }
    );


/* Next */

document
    .getElementById("galleryNext")
    .addEventListener(
        "click",
        function () {

            currentGallery++;

            if (
                currentGallery >=
                galleryImages.length
            ) {

                currentGallery = 0;
            }

            showGalleryImage(
                currentGallery
            );
        }
    );


/* Initial viewer sizing */

resizeViewer();