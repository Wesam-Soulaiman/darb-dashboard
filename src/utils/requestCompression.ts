import { gzip } from "pako";

// Shared opt-in threshold for large JSON bodies; the interceptor still skips
// FormData, files, non-JSON payloads, and requests below this size.
export const LARGE_JSON_GZIP_MIN_BYTES = 5 * 1024;
export const MIN_GZIP_SIZE_BYTES = LARGE_JSON_GZIP_MIN_BYTES;

const textEncoder = new TextEncoder();

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
};

const isBinaryOrMultipartPayload = (data: unknown): boolean => {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (
    data instanceof FormData ||
    data instanceof Blob ||
    data instanceof ArrayBuffer ||
    data instanceof URLSearchParams
  ) {
    return true;
  }

  if (typeof File !== "undefined" && data instanceof File) {
    return true;
  }

  return ArrayBuffer.isView(data);
};

const isCompressibleJsonPayload = (data: unknown): boolean => {
  if (isBinaryOrMultipartPayload(data)) {
    return false;
  }

  return Array.isArray(data) || isPlainObject(data);
};

const stringifyJsonPayload = (data: unknown): string | null => {
  if (!isCompressibleJsonPayload(data)) {
    return null;
  }

  try {
    const json = JSON.stringify(data);

    return typeof json === "string" ? json : null;
  } catch {
    return null;
  }
};

export const gzipJsonPayload = (data: unknown): Uint8Array => {
  const json = stringifyJsonPayload(data);

  if (json === null) {
    throw new TypeError("Only JSON-serializable objects and arrays can be compressed.");
  }

  return gzip(json);
};

export const getJsonSizeBytes = (data: unknown): number => {
  const json = stringifyJsonPayload(data);

  if (json === null) {
    return 0;
  }

  return textEncoder.encode(json).byteLength;
};

export const shouldCompressJsonPayload = (
  data: unknown,
  minSize = MIN_GZIP_SIZE_BYTES,
): boolean => {
  if (!isCompressibleJsonPayload(data)) {
    return false;
  }

  return getJsonSizeBytes(data) >= minSize;
};
