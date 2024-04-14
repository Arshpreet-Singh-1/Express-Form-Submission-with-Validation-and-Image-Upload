// Importing necessary modules
const express = require('express'); // Express.js framework
const { body, validationResult } = require('express-validator'); // Middleware for form validation
const bodyParser = require('body-parser'); // Middleware for parsing incoming request bodies
const multer = require('multer'); // Middleware for handling file uploads
const path = require('path'); // Module for working with file and directory paths

// Initializing the Express application
const app = express();
const port = 3000; // Port on which the server will run

// Serving static files from the 'public' directory
app.use(express.static('public'));
// Serving uploaded files from the 'uploads' directory under the '/uploads' URL path
app.use('/uploads', express.static('uploads'));

// Setting EJS as the view engine for rendering dynamic content
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generating unique filenames for uploaded files
  }
});
const upload = multer({ storage: storage });

// Route to serve the form (GET request)
app.get('/', (req, res) => {
  res.render('form-validate', { errors: null }); // Rendering the form with no errors initially
});

// Validation rules for form submission with image
const validateFormWithImage = [
  body('name').isLength({ min: 5 }).withMessage('Name is required with min. 5 chars'), // Validation for 'name' field
  body('email').isEmail().withMessage('Invalid email'), // Validation for 'email' field
  body('image').custom((value, { req }) => { // Custom validation for 'image' field
    if (!req.file) { // Checking if 'image' file was uploaded
      throw new Error('Image is required'); // Throwing an error if 'image' file is missing
    }
    return true; // Returning true if validation passes
  })
];

// Route to handle form submission with validation and image upload (POST request)
app.post('/submit', upload.single('image'), validateFormWithImage, (req, res) => {
  const errors = validationResult(req); // Validating the request and storing validation errors

  if (!errors.isEmpty()) { // Checking if there are validation errors
    return res.render('form-validate', { errors: errors.array() }); // Rendering the form with validation errors
  }

  // Extracting data from the request body
  const { name, email } = req.body;
  const imagePath = req.file.path; // Path to the uploaded image

  // Rendering a success page with submitted data
  res.render('submission-validate', { name, email, imagePath });
});

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
