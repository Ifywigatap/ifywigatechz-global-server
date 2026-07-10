import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// In a Node.js environment, DOMPurify needs a `window` object.
// We create one with JSDOM.
const { window } = new JSDOM('');
const purify = DOMPurify(window);

// Middleware to sanitize req.body and other parts of the request.
const xssSanitizer = (req, res, next) => {
  // Sanitize req.body
  if (req.body) {
    sanitizeObject(req.body);
  }
  // You could also sanitize req.query and req.params if needed
  // if (req.query) sanitizeObject(req.query);
  // if (req.params) sanitizeObject(req.params);

  next();
};

const sanitizeObject = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = purify.sanitize(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
};

export default xssSanitizer;