// Minimal shims to provide browser-like globals expected by some packages when run in Node during build
// Only define globals if they aren't already available to avoid interfering with real environments.

if (typeof globalThis.File === 'undefined') {
  // Minimal File polyfill — enough for packages that check for existence
  function FileShim(parts, name, opts) {
    var size = 0;
    var buffers = parts.map(function (p) {
      if (typeof p === 'string') {
        var enc = new TextEncoder();
        var b = enc.encode(p);
        size += b.length;
        return b;
      }
      if (p instanceof Uint8Array) {
        size += p.length;
        return p;
      }
      return new Uint8Array();
    });
    var superBuf = new Uint8Array(size);
    var offset = 0;
    for (var i = 0; i < buffers.length; i++) {
      var b = buffers[i];
      superBuf.set ? superBuf.set(b, offset) : (superBuf[offset] = b);
      offset += b.length;
    }
    superBuf.name = name || '';
    superBuf.lastModified = (opts && opts.lastModified) || Date.now();
    superBuf.size = size;
    superBuf.type = (opts && opts.type) || '';
    return superBuf;
  }

  globalThis.File = FileShim;
}

if (typeof globalThis.Blob === 'undefined') {
  function BlobShim(parts, opts) {
    var size = 0;
    var buffers = parts.map(function (p) {
      if (typeof p === 'string') {
        var enc = new TextEncoder();
        var b = enc.encode(p);
        size += b.length;
        return b;
      }
      if (p instanceof Uint8Array) {
        size += p.length;
        return p;
      }
      return new Uint8Array();
    });
    var superBuf = new Uint8Array(size);
    var offset = 0;
    for (var i = 0; i < buffers.length; i++) {
      var b = buffers[i];
      superBuf.set ? superBuf.set(b, offset) : (superBuf[offset] = b);
      offset += b.length;
    }
    superBuf.size = size;
    superBuf.type = (opts && opts.type) || '';
    return superBuf;
  }

  globalThis.Blob = BlobShim;
}

if (typeof globalThis.FormData === 'undefined') {
  function FormDataShim() {
    this._data = [];
  }
  FormDataShim.prototype.append = function (name, value, filename) {
    this._data.push({ name: name, value: value, filename: filename });
  };
  FormDataShim.prototype.getAll = function () {
    return this._data;
  };

  globalThis.FormData = FormDataShim;
}
