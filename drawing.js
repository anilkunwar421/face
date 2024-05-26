function drawBlurredVideo(video, displaySize) {
  const blurCanvas = document.getElementById("blur-canvas");
  const blurCtx = blurCanvas.getContext("2d");
  blurCtx.clearRect(0, 0, displaySize.width, displaySize.height);
  blurCtx.filter = "blur(10px)";
  blurCtx.drawImage(video, 0, 0, displaySize.width, displaySize.height);
}

function drawClearVideo(video, displaySize) {
  const clearCanvas = document.getElementById('clear-canvas');
  const clearCtx = clearCanvas.getContext('2d');
  clearCtx.clearRect(0, 0, displaySize.width, displaySize.height);

  const centerX = displaySize.width / 2;
  const centerY = displaySize.height / 2 - (displaySize.height * 0.1); // Move the ellipse slightly upward

  // Ensure the radii fit within the screen boundaries
  const maxRadiusX = displaySize.width / 2;
  const maxRadiusY = displaySize.height / 2;

  // Define the oval dimensions while ensuring it stays within the screen
  const radiusX = Math.min(displaySize.width * 0.3, maxRadiusX);
  const radiusY = Math.min(displaySize.height * 0.4, maxRadiusY*0.6);

  // Draw the blurred video as a background
  const blurCanvas = document.getElementById('blur-canvas');
  const blurCtx = blurCanvas.getContext('2d');
  blurCtx.filter = 'blur(10px)';
  blurCtx.drawImage(video, 0, 0, displaySize.width, displaySize.height);

  // Draw the clear video in the ellipse
  clearCtx.save();
  clearCtx.beginPath();
  clearCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  clearCtx.clip();
  clearCtx.drawImage(video, 0, 0, displaySize.width, displaySize.height);
  clearCtx.restore();

  // Draw the border around the ellipse
  clearCtx.beginPath();
  clearCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  clearCtx.lineWidth = 5;
  clearCtx.strokeStyle = 'red';
  clearCtx.stroke();
}
function updateEllipseBorderColor(displaySize,color) {
  const clearCanvas = document.getElementById('clear-canvas');
  const clearCtx = clearCanvas.getContext('2d');
  const centerX = displaySize.width / 2;
  const centerY = displaySize.height / 2 - (displaySize.height * 0.1); // Move the ellipse slightly upward

  // Ensure the radii fit within the screen boundaries
  const maxRadiusX = displaySize.width / 2;
  const maxRadiusY = displaySize.height / 2;

  // Define the oval dimensions while ensuring it stays within the screen
  const radiusX = Math.min(displaySize.width * 0.3, maxRadiusX);
  const radiusY = Math.min(displaySize.height * 0.4, maxRadiusY*0.6);
  clearCtx.beginPath();
  clearCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  clearCtx.lineWidth = 5;
  clearCtx.strokeStyle = color;
  clearCtx.stroke();
}