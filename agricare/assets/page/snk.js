var thePdf = null;
var scalePdf = 1;

// $(function () {
//     setTimeout(() => {
//         showPdfSnk()
//     }, 500);
// })

function showPdfSnk() {

    url = encodeURI('https://syngenta-project.sekawanmedia.co.id/qrdev/dokumen/snk/snk.pdf');
    var PDFJS = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    PDFJS.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

    PDFJS.getDocument(url).promise.then(function (pdf) {
        thePdf = pdf;
        viewer = document.getElementById('div-iframe-snkk');

        for (page = 1; page <= pdf.numPages; page++) {
            canvas = document.createElement("canvas");
            canvas.className = 'pdf-page-canvas w-100';
            canvas.id = "viewer";
            viewer.appendChild(canvas);
            renderPage(page, canvas);
        }
        
    });
}

function renderPage(pageNumber, canvas) {
    thePdf.getPage(pageNumber).then(function (page) {
        viewport = page.getViewport({ scale: scalePdf });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
    });
}