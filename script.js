async function processImage(imageData) {
  const { data: { text } } = await Tesseract.recognize(
    imageData,
    'eng', // мова (можете змінити на потрібну)
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
  }).catch(err => {
    console.error('Error recognizing text:', err);
  });
  

  const regex = /2:(.*)\n8:(.*)\nIssuance Date:(.*)\nISS:(.*)/g;
  const match = regex.exec(text);

  if (match) {
    document.getElementById('fullName').textContent = match[1].trim();
    document.getElementById('address').textContent = match[2].trim();
    document.getElementById('issuanceDate').textContent = match[3].trim();
    document.getElementById('expirationDate').textContent = match[4].trim();
    document.getElementById('license-details').classList.remove('d-none');
  } else {
    alert('License information not found.');
  }
}

function captureImage() {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/jpeg');
  processImage(imageData);
}

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    const video = document.getElementById('video');
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Error accessing webcam:', err);
  });