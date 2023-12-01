document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('drawingCanvas');
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var startX, startY;
    var rgbValues = [];
    var totalLength = 0;

    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);     
    }

    function startDrawing(e) {
        drawing = true;
        totalLength = 0;
        rgbValues = [];
        [startX, startY] = [e.offsetX, e.offsetY];
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }

    function drawLine(e) {
        if (!drawing) return;
        
        let endX = e.offsetX;
        let endY = e.offsetY;
        
        ctx.lineTo(endX, endY);
        ctx.stroke();

        let deltaX = endX - startX;
        let deltaY = endY - startY;
        let segmentLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        totalLength += segmentLength;

        sampleRGBAlongLine(startX, startY, endX, endY, segmentLength);

        [startX, startY] = [endX, endY];
    }

    function stopDrawing(e) {
        if (!drawing) return;
        drawing = false;
        updateDisplayInfo();

        let highRGBCount = rgbValues.filter(rgb => {
            let components = rgb.match(/\d+/g).map(Number);
            return components[0] > 90 && components[1] > 90 && components[2] > 90;
        }).length;

        if (Math.floor(highRGBCount) > Math.floor(document.getElementById('totalLength').textContent)) {
	    highRGBCount = Math.floor(document.getElementById('totalLength').textContent)
	}

        document.getElementById('rgbCount').textContent = highRGBCount;
    }

    function sampleRGBAlongLine(x0, y0, x1, y1, length) {
        let steps = length;
        let dx = (x1 - x0) / steps;
        let dy = (y1 - y0) / steps;
        for (let i = 0; i <= steps; i++) {
            let x = x0 + dx * i;
            let y = y0 + dy * i;
            var pixelData = ctx.getImageData(x, y, 1, 1).data;
            rgbValues.push(`rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`);
        }
    }

    function updateDisplayInfo() {
        document.getElementById('totalLength').textContent = Math.floor(totalLength).toString();
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
});

