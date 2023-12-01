document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('drawingCanvas');
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var startX, startY;

    function startDrawing(e) {
        drawing = true;
        [startX, startY] = [e.offsetX, e.offsetY];
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }

    function drawLine(e) {
        if (!drawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    function stopDrawing(e) {
        if (!drawing) return;
        drawing = false;
        let deltaX = e.offsetX - startX;
        let deltaY = e.offsetY - startY;
        let pixelLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        alert(`Line length: ${pixelLength} pixels`);
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
});

