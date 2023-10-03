let mediaRecorder;
let audioChunks = [];
let startTime;
let endTime;

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const recordingInfo = document.getElementById('recordingInfo');
const downloadLink = document.getElementById('downloadLink');

startButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstart = () => {
            startTime = new Date().toLocaleTimeString();
            recordingInfo.textContent = `Recording started at ${startTime}`;
            stopButton.style.display = 'block';
            startButton.style.display = 'none';
        };

        mediaRecorder.onstop = () => {
            endTime = new Date().toLocaleTimeString();
            recordingInfo.textContent = `Recording ended at ${endTime}`;
            const blob = new Blob(audioChunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.style.display = 'block';
            downloadLink.download = `recording_${startTime}.wav`;
            audioChunks = [];
            startButton.style.display = 'block';
            stopButton.style.display = 'none';
        };

        mediaRecorder.start();
    } catch (error) {
        console.error('Error accessing microphone:', error);
    }
});

stopButton.addEventListener('click', () => {
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
});