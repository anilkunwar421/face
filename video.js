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

function startVideo() {
  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
    }
  })
    .then(stream => {
      const video = document.getElementById('video');
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', () => {
        adjustContainer(video.videoWidth, video.videoHeight);
      });
      video.addEventListener('play', onPlay);
    })
    .catch(err => console.error('Error accessing camera: ', err));
}

function adjustContainer(width, height) {
  const container = document.getElementById('container');
  container.style.width = '100vw';
  container.style.height = '100vh';
}

function onPlay() {
  const video = document.getElementById('video');
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  const blurCanvas = document.getElementById('blur-canvas');
  const clearCanvas = document.getElementById('clear-canvas');
  faceapi.matchDimensions(blurCanvas, displaySize);
  faceapi.matchDimensions(clearCanvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    drawBlurredVideo(video, displaySize);
    drawClearVideo(video, displaySize);

    if (resizedDetections.length > 0) {
      const landmarks = resizedDetections[0].landmarks;
      const boundingBox = resizedDetections[0].detection.box;
      const nose = landmarks.getNose();
      const noseTip = nose[3]; // Use the tip of the nose for tracking

      detectHeadMovement(noseTip, displaySize);
      checkFaceInsideCircle(boundingBox, displaySize);
      // updateOverlay('green');
    } else {
      // updateOverlay('red');
    }
  }, 100);
}

