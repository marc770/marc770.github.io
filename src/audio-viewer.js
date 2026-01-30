import { LitElement, html, css } from 'lit';

export class AudioViewer extends LitElement {

    static styles = css`
    :host {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .container {
      width: 100%;
      max-width: 780px;
      background: #ffffff10;
      backdrop-filter: blur(14px);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #ffffff22;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }

    h2 {
      margin: 0 0 8px 0;
      font-size: 1.4rem;
      font-weight: 600;
      color: #f5f5f5;
    }

    .filebox {
      margin: 18px 0;
    }

    input[type=file] {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #ffffff22;
      background: #ffffff15;
      color: #ddd;
    }

    .meta {
      margin: 12px 0 20px 0;
      font-size: 0.95rem;
      color: #ccc;
    }

    canvas {
      width: 100%;
      height: 140px;
      margin-bottom: 20px;
      background: #111;
      border-radius: 8px;
      border: 1px solid #333;
    }
  `;

    constructor() {
        super();
        this.fileName = null;
        this.audioBuffer = null;
        this.meta = {};
    }

    render() {
        return html`
      <div class="container">
        <h2>Upload audio (.wav)</h2>

        <div class="filebox">
          <input type="file" accept="audio/wav" @change=${this.onFile} />
        </div>

        ${this.fileName ? html`
          <div class="meta">
            <strong>${this.fileName}</strong><br />
            Duration: ${this.meta.duration.toFixed(2)} sec<br />
            Sample Rate: ${this.meta.sampleRate} Hz<br />
            Channels: ${this.meta.channels}
          </div>
        ` : ''}

        <canvas id="wave"></canvas>

        <audio id="player" controls></audio>
      </div>
    `;
    }

    async onFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        this.fileName = file.name;
        const arrayBuffer = await file.arrayBuffer();

        const ctx = new AudioContext();
        this.audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        // Extract metadata
        this.meta = {
            duration: this.audioBuffer.duration,
            sampleRate: this.audioBuffer.sampleRate,
            channels: this.audioBuffer.numberOfChannels
        };
        this.requestUpdate();

        // Set audio player source
        const url = URL.createObjectURL(file);
        this.shadowRoot.querySelector("#player").src = url;

        this.drawWaveform();
        this.computeRMS();
    }

    // ---- Waveform ----
    drawWaveform() {
        const canvas = this.shadowRoot.getElementById("wave");
        const ctx = canvas.getContext("2d");
        const { width, height } = canvas;

        const data = this.audioBuffer.getChannelData(0);
        const step = Math.floor(data.length / width);
        const amp = height / 2;

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.strokeStyle = "#00e0a8";

        for (let i = 0; i < width; i++) {
            const slice = data[i * step] || 0;
            const y = (1 - slice) * amp;
            ctx.lineTo(i, y);
        }

        ctx.stroke();
    }


    // ---- RMS Loudness (overall amplitude) ----
    computeRMS() {
        const data = this.audioBuffer.getChannelData(0);
        let sumSquares = 0;

        for (let i = 0; i < data.length; i++) {
            sumSquares += data[i] * data[i];
        }

        const rms = Math.sqrt(sumSquares / data.length); // 0–1
        const rmsPercent = Math.min(100, rms * 200); // scaled for UI

        const fill = this.shadowRoot.getElementById("rmsFill");
        fill.style.width = `${rmsPercent}%`;
    }
}

customElements.define("audio-viewer", AudioViewer);
``