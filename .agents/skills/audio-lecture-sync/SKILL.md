---
name: audio-lecture-sync
description: >-
  GoodNotes-style synchronized audio recording, waveform canvas visualization,
  audio bookmarking linked to document pages, and Web Audio API streaming.
---

# Audio Lecture Recording & Page Sync Skill

This skill provides patterns for implementing synchronized audio recordings alongside lecture slides and academic sheets, enabling students to record university lectures while writing notes and play back the audio linked to specific pages.

---

## 1. Web Audio Recording & MediaRecorder Pipeline

```javascript
class LectureAudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.isRecording = false;
    this.pageTimestamps = []; // { page: 1, timestamp: 0 }
  }

  async startRecording(initialPage = 1) {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    source.connect(this.analyser);

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/mp4';

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
    this.audioChunks = [];
    this.pageTimestamps = [{ page: initialPage, time: 0 }];
    this.startTime = Date.now();

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.start(1000); // 1-second chunks
    this.isRecording = true;
  }

  markPageChange(newPage) {
    if (!this.isRecording) return;
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    this.pageTimestamps.push({ page: newPage, time: elapsedSeconds });
  }

  async stopRecording() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
        this.stream.getTracks().forEach((t) => t.stop());
        this.isRecording = false;
        resolve({
          blob: audioBlob,
          url: URL.createObjectURL(audioBlob),
          timestamps: this.pageTimestamps
        });
      };
      this.mediaRecorder.stop();
    });
  }
}
```

---

## 2. Live Neon Waveform Visualizer (Canvas RAF)

```javascript
function startWaveformVisualizer(canvas, analyser) {
  const ctx = canvas.getContext('2d');
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  draw();
}
```

---

## 3. Synchronized Playback by Page

```javascript
function playAudioAtPage(audioElement, timestamps, pageNum) {
  const match = timestamps.slice().reverse().find((t) => t.page === pageNum);
  if (match) {
    audioElement.currentTime = match.time;
    audioElement.play();
  }
}
```
