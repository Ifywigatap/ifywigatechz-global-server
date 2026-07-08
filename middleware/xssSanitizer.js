import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// Create a JSDOM window and a DOMPurify instance.
// This is done once when the module is loaded for efficiency.
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Recursively sanitizes an object by cleaning all its string properties.
 * @param {any} obj - The object or value to sanitize.
 * @returns {any} The sanitized object or value.
 */
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        // Sanitize string values against XSS
        obj[key] = purify.sanitize(value);
      } else if (typeof value === 'object') {
        // Recurse into nested objects or arrays
        sanitizeObject(value);
      }
    }
  }
  return obj;
};

// The Express middleware function to sanitize req.body, req.query, and req.params
export const xssSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};