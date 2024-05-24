function drawBlurredVideo(video, displaySize) {
    const blurCanvas = document.getElementById('blur-canvas');
    const blurCtx = blurCanvas.getContext('2d');
    blurCtx.clearRect(0, 0, displaySize.width, displaySize.height);
    blurCtx.filter = 'blur(10px)';
    blurCtx.drawImage(video, 0, 0, displaySize.width, displaySize.height);
  }
  
  function drawClearVideo(video, displaySize) {
    const clearCanvas = document.getElementById('clear-canvas');
    const clearCtx = clearCanvas.getContext('2d');
    clearCtx.clearRect(0, 0, displaySize.width, displaySize.height);
  
    const centerX = displaySize.width / 2;
    const centerY = displaySize.height / 3;
    const radiusX = displaySize.width * 0.25;
    const radiusY = displaySize.height * 0.25;
  
    clearCtx.save();
    clearCtx.beginPath();
    clearCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    clearCtx.clip();
    clearCtx.drawImage(video, 0, 0, displaySize.width, displaySize.height);
    clearCtx.restore();
  }
  
  
  function drawMask(displaySize) {
    const blurCanvas = document.getElementById('blur-canvas');
    const blurCtx = blurCanvas.getContext('2d');
    const centerX = displaySize.width / 2;
    const centerY = displaySize.height / 3;
    const radiusX = displaySize.width * 0.40;
    const radiusY = displaySize.height * 0.25;
  
    // Draw the blurred video first
    blurCtx.save();
    blurCtx.globalCompositeOperation = 'destination-out';
    blurCtx.beginPath();
    blurCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    blurCtx.fill();
    blurCtx.restore();
  
    // Draw the unblurred video within the circle
    blurCtx.save();
    blurCtx.globalCompositeOperation = 'destination-in';
    blurCtx.beginPath();
    blurCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    blurCtx.clip();
    blurCtx.drawImage(video, 0, 0, displaySize.width, displaySize.height);
    blurCtx.restore();
  }
  
  function updateOverlay(color) {
    const overlay = document.getElementById('overlay');
    overlay.style.setProperty('--border-color', color);
  }
  
  
  
  