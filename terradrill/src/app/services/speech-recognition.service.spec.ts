import { vi } from 'vitest';

/**
 * The service resolves the constructor once at module load, so the global has
 * to be stubbed before importing it — hence resetModules + dynamic import.
 */
class FakeRecognition {
  static last: FakeRecognition | undefined;

  lang = '';
  interimResults = true;
  maxAlternatives = 0;
  continuous = true;

  starts = 0;
  stops = 0;

  onstart: (() => void) | null = null;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;

  constructor() {
    FakeRecognition.last = this;
  }

  start() {
    this.starts++;
    this.onstart?.();
  }

  stop() {
    this.stops++;
    this.onend?.();
  }

  /** Shaped like SpeechRecognitionEvent: a list of results, each a list of
      alternatives ranked by confidence. */
  emitResult(transcript: string) {
    this.onresult?.({ results: [[{ transcript, confidence: 1 }]] });
  }

  emitError(error: string) {
    this.onerror?.({ error });
  }
}

async function loadService(ctor: unknown) {
  vi.resetModules();
  vi.stubGlobal('SpeechRecognition', ctor);
  vi.stubGlobal('webkitSpeechRecognition', undefined);

  const { SpeechRecognitionService } = await import('./speech-recognition.service');
  return new SpeechRecognitionService();
}

describe('SpeechRecognitionService', () => {
  afterEach(() => vi.unstubAllGlobals());

  describe('when the browser supports it', () => {
    let service: Awaited<ReturnType<typeof loadService>>;

    beforeEach(async () => {
      FakeRecognition.last = undefined;
      service = await loadService(FakeRecognition);
    });

    it('reports support', () => {
      expect(service.supported).toBe(true);
    });

    it('starts empty', () => {
      expect(service.transcript()).toBe('');
      expect(service.listening()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('builds the recogniser lazily, on first start', () => {
      expect(FakeRecognition.last).toBeUndefined();
      service.start();
      expect(FakeRecognition.last).toBeDefined();
    });

    it('configures the recogniser for single final results', () => {
      service.start();
      const recognition = FakeRecognition.last!;

      expect(recognition.lang).toBe('en-US');
      expect(recognition.interimResults).toBe(false);
      expect(recognition.maxAlternatives).toBe(1);
      expect(recognition.continuous).toBe(false);
    });

    it('tracks listening from the recogniser, not the caller', () => {
      service.start();
      expect(service.listening()).toBe(true);

      // The recogniser stops itself once it has a result.
      FakeRecognition.last!.onend?.();
      expect(service.listening()).toBe(false);
    });

    it('captures the transcript, trimmed', () => {
      service.start();
      FakeRecognition.last!.emitResult('  New Zealand  ');
      expect(service.transcript()).toBe('New Zealand');
    });

    it('records the error code', () => {
      service.start();
      FakeRecognition.last!.emitError('not-allowed');
      expect(service.error()).toBe('not-allowed');
    });

    it('clears the previous transcript when starting again', () => {
      service.start();
      FakeRecognition.last!.emitResult('Brazil');
      FakeRecognition.last!.onend?.();

      service.start();
      expect(service.transcript()).toBe('');
    });

    it('ignores start while already listening', () => {
      service.start();
      service.start();
      expect(FakeRecognition.last!.starts).toBe(1);
    });

    it('toggles between start and stop', () => {
      service.toggle();
      expect(service.listening()).toBe(true);

      service.toggle();
      expect(service.listening()).toBe(false);
      expect(FakeRecognition.last!.stops).toBe(1);
    });

    it('reuses one recogniser across starts', () => {
      service.start();
      const first = FakeRecognition.last;
      service.stop();
      service.start();

      expect(FakeRecognition.last).toBe(first);
    });

    it('reset clears transcript and error', () => {
      service.start();
      FakeRecognition.last!.emitResult('Brazil');
      FakeRecognition.last!.emitError('no-speech');

      service.reset();

      expect(service.transcript()).toBe('');
      expect(service.error()).toBeNull();
    });
  });

  describe('when the browser does not support it', () => {
    it('reports no support and stays inert', async () => {
      const service = await loadService(undefined);

      expect(service.supported).toBe(false);
      expect(() => service.start()).not.toThrow();
      expect(() => service.stop()).not.toThrow();
      expect(() => service.toggle()).not.toThrow();
      expect(service.listening()).toBe(false);
    });
  });
});
