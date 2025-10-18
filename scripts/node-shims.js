// Minimal shims to provide browser-like globals expected by some packages when run in Node during build
// Only define globals if they aren't already available to avoid interfering with real environments.

if (typeof globalThis.File === 'undefined') {
  // Minimal File polyfill — enough for packages that check for existence
  class FileShim extends Uint8Array {
    constructor(parts, name, opts) {
      let size = 0;
      const buffers = parts.map((p) => {
        if (typeof p === 'string') {
          const enc = new TextEncoder();
          const b = enc.encode(p);
          size += b.length;
          return b;
        }
        if (p instanceof Uint8Array) {
          size += p.length;
          return p;
        }
        return new Uint8Array();
      });
      super(size);
      let offset = 0;
      for (const b of buffers) {
        super.set ? this.set(b, offset) : (this[offset] = b);
        offset += b.length;
      }
      this.name = name || '';
      this.lastModified = (opts && opts.lastModified) || Date.now();
      this.size = size;
      this.type = (opts && opts.type) || '';
    }
  }

  globalThis.File = FileShim;
}

if (typeof globalThis.Blob === 'undefined') {
  class BlobShim extends Uint8Array {
    constructor(parts, opts) {
      let size = 0;
      const buffers = parts.map((p) => {
        if (typeof p === 'string') {
          const enc = new TextEncoder();
          const b = enc.encode(p);
          size += b.length;
          return b;
        }
        if (p instanceof Uint8Array) {
          size += p.length;
          return p;
        }
        return new Uint8Array();
      });
      super(size);
      let offset = 0;
      for (const b of buffers) {
        super.set ? this.set(b, offset) : (this[offset] = b);
        offset += b.length;
      }
      this.size = size;
      this.type = (opts && opts.type) || '';
    }
  }

  globalThis.Blob = BlobShim;
}

if (typeof globalThis.FormData === 'undefined') {
  class FormDataShim {
    constructor() {
      this._data = [];
    }
    append(name, value, filename) {
      this._data.push({ name, value, filename });
    }
    getAll() {
      return this._data;
    }
  }

  globalThis.FormData = FormDataShim;
}
