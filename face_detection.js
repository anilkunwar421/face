const modelBaseUrl = window.location.pathname.includes('/face/')
  ? '/face/models'
  : 'models';
// Load the models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(modelBaseUrl),
  faceapi.nets.faceLandmark68Net.loadFromUri(modelBaseUrl),
  faceapi.nets.faceRecognitionNet.loadFromUri(modelBaseUrl),
  faceapi.nets.faceExpressionNet.loadFromUri(modelBaseUrl)
]).then(startVideo);

// Start the video stream with 4:3 aspect ratio
function startVideo() {
  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      width: { ideal: 640 },
      height: { ideal: 480 }
    }
  })
    .then(stream => {
      const video = document.getElementById('video');
      video.srcObject = stream;
    })
    .catch(err => console.error('Error accessing camera: ', err));
}

const video = document.getElementById('video');
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    drawCircleWithDots(ctx, displaySize);

    if (resizedDetections.length > 0) {
      const landmarks = resizedDetections[0].landmarks;
      const nose = landmarks.getNose();
      const noseTip = nose[3]; // Use the tip of the nose for tracking

      // Track head movement and update the circle
      detectHeadMovement(noseTip, displaySize, ctx);
    }
  }, 100);
});

// Blink Detection
let blinkCount = 0;
function detectBlink(leftEye, rightEye) {
  const leftEAR = getEAR(leftEye);
  const rightEAR = getEAR(rightEye);

  if (leftEAR < 0.25 && rightEAR < 0.25) {
    blinkCount++;
    console.log('Blink Detected');
  }
}

// Eye Aspect Ratio (EAR)
function getEAR(eye) {
  const A = distance(eye[1], eye[5]);
  const B = distance(eye[2], eye[4]);
  const C = distance(eye[0], eye[3]);
  return (A + B) / (2.0 * C);
}

// Distance between two points
function distance(point1, point2) {
  return Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));
}

// Rounding Face Detection
const numDots = 8;
let headPositions = [];
let filledDots = new Array(numDots).fill(false);
const trackingWindow = 50;

function detectHeadMovement(noseTip, displaySize, ctx) {
  headPositions.push({ x: noseTip.x, y: noseTip.y });

  if (headPositions.length > trackingWindow) {
    headPositions.shift(); // Keep only the latest positions
  }

  if (headPositions.length === trackingWindow) {
    // Check if the movement forms a circle
    const isCircular = isCircularMovement(headPositions);
    if (isCircular) {
      updateDots(noseTip, displaySize);
      drawCircleWithDots(ctx, displaySize);
      if (filledDots.every(filled => filled)) {
        console.log('Face Rounded Movement Detected');
      }
    }
  }
}

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
