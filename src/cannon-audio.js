// Original rotary-cannon sound design. A burst represents several audible rounds
// per simulation shot; it does not change projectile damage or firing cadence.
// No recordings, laser oscillators or external audio downloads are used here.
export function cannonSamples(sampleRate, variant = 0) {
  const duration = 0.165;
  const output = new Float32Array(Math.ceil(sampleRate * duration));
  let seed = 87123 + variant * 977;
  const noise = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2147483648 - 1;
  };
  // 60 rounds/s: a tight mechanical roar with short pressure cracks and a
  // low-frequency body, instead of the old widely spaced, overdriven double pop.
  for (let round = 0; round < 8; round++) {
    const start = round / 60 + (round ? noise() * 0.0005 : 0);
    const strength = 0.86 + noise() * 0.1;
    let low = 0,
      body = 0;
    const lowMix = 1 - Math.exp((-2 * Math.PI * 2300) / sampleRate);
    const bodyMix = 1 - Math.exp((-2 * Math.PI * 340) / sampleRate);
    for (
      let j = Math.max(0, Math.floor(start * sampleRate));
      j < output.length;
      j++
    ) {
      const t = j / sampleRate - start;
      if (t < 0 || t > 0.047) continue;
      const white = noise();
      low += (white - low) * lowMix;
      body += (low - body) * bodyMix;
      const attack = 1 - Math.exp(-t * 11000);
      const crack = low * Math.exp(-t * 620) * 0.7;
      const pressure =
        Math.sin(2 * Math.PI * (105 * t + 0.22 * (1 - Math.exp(-t * 190)))) *
        Math.exp(-t * 160) *
        0.34;
      const combustion = body * Math.exp(-t * 105) * 1.3;
      const mechanism =
        (low - body) * Math.exp(-Math.abs(t - 0.008) * 950) * 0.12;
      output[j] +=
        (crack + pressure + combustion + mechanism) * attack * strength;
    }
  }
  let previous = 0,
    highPassed = 0,
    peak = 0;
  const dcPole = Math.exp((-2 * Math.PI * 35) / sampleRate);
  for (let i = 0; i < output.length; i++) {
    const input = output[i];
    highPassed = input - previous + dcPole * highPassed;
    previous = input;
    const fade = Math.min(
      1,
      i / (sampleRate * 0.001),
      (output.length - 1 - i) / (sampleRate * 0.015),
    );
    output[i] = highPassed * fade;
    peak = Math.max(peak, Math.abs(output[i]));
  }
  const scale = 0.72 / Math.max(peak, 0.001);
  for (let i = 0; i < output.length; i++) output[i] *= scale;
  return output;
}

export function createCannonBuffers(context) {
  return Array.from({ length: 4 }, (_, variant) => {
    const samples = cannonSamples(context.sampleRate, variant);
    const buffer = context.createBuffer(1, samples.length, context.sampleRate);
    buffer.getChannelData(0).set(samples);
    return buffer;
  });
}
