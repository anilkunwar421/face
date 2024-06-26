function checkFaceInsideCircle(boundingBox, displaySize) {
  const centerX = displaySize.width / 2;
  const centerY = displaySize.height / 2 - (displaySize.height * 0.1); // Move the ellipse slightly upward

  const radiusX = Math.min(displaySize.width * 0.3, displaySize.width / 2); // 30% of width or max half width
  const radiusY = Math.min(displaySize.height * 0.4, displaySize.height / 2) * 0.6; // 40% of height or max half height, scaled by 0.6

  const boxCenterX = boundingBox.x + boundingBox.width / 2;
  const boxCenterY = boundingBox.y + boundingBox.height / 2;

  const distX = Math.abs(boxCenterX - centerX);
  const distY = Math.abs(boxCenterY - centerY);

  const isInsideHorizontal = (distX <= radiusX);
  const isInsideVertical = (distY <= radiusY);

  if (isInsideHorizontal && isInsideVertical) {
    // Face is inside the ellipse
    updateEllipseBorderColor(displaySize,'green');
  } else {
    // Face is outside the ellipse
    updateEllipseBorderColor(displaySize,'red');
  }
}

  
  
  
  function detectHeadMovement(noseTip, displaySize) {
    // Implementation for detecting head movement
  }
  
  function getEAR(eye) {
    const A = distance(eye[1], eye[5]);
    const B = distance(eye[2], eye[4]);
    const C = distance(eye[0], eye[3]);
    return (A + B) / (2.0 * C);
  }
  
  function distance(point1, point2) {
    return Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));
  }
  
  function detectBlink(leftEye, rightEye) {
    const leftEAR = getEAR(leftEye);
    const rightEAR = getEAR(rightEye);
  
    if (leftEAR < 0.25 && rightEAR < 0.25) {
    //   console.log('Blink Detected');
    }
  }
  
  const numDots = 8;
  let headPositions = [];
  let filledDots = new Array(numDots).fill(false);
  const trackingWindow = 50;
  
  function isCircularMovement(positions) {
    const centerX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
    const centerY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
  
    let radiusSum = 0;
    positions.forEach(pos => {
      radiusSum += Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));
    });
    const avgRadius = radiusSum / positions.length;
  
    let variance = 0;
    positions.forEach(pos => {
      const distanceFromCenter = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));
      variance += Math.pow(distanceFromCenter - avgRadius, 2);
    });
    variance /= positions.length;
  
    return variance < 500; // Adjust this threshold based on testing
  }
  
  function updateDots(position, displaySize) {
    const centerX = displaySize.width / 2;
    const centerY = displaySize.height / 2;
    const angle = Math.atan2(position.y - centerY, position.x - centerX);
    const index = Math.round(((angle + Math.PI) / (2 * Math.PI)) * numDots) % numDots;
    filledDots[index] = true;
  }
  
  function drawCircleWithDots(ctx, displaySize) {
    const centerX = displaySize.width / 2;
    const centerY = displaySize.height / 2;
    const radius = Math.min(displaySize.width, displaySize.height) / 3;
    const angleStep = (2 * Math.PI) / numDots;
  
    for (let i = 0; i < numDots; i++) {
      const angle = i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
      ctx.fillStyle = filledDots[i] ? 'green' : 'black';
      ctx.fill();
    }
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'gray';
    ctx.stroke();
  }
  