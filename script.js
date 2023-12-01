document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('drawingCanvas');
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var rgbValues = []; // 用來儲存 RGB 值的陣列

    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = function(){
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);     
    }

    function startDrawing(e) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    function drawLine(e) {
        if (!drawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        // 擷取目前滑鼠位置的像素的 RGB 值
        var pixelData = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        rgbValues.push(`rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`);
    }

    function stopDrawing(e) {
        drawing = false;
        // 輸出所有紀錄的 RGB 值
        console.log(rgbValues);
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
});

