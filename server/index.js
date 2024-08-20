const express = require('express');
const cors = require('cors');
// const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');
const path = require('path');
const app = express();
app.set('trust proxy', 1); // Trust first proxy (Heroku)


// Helmet for security headers
app.use(helmet());

// (async () => {
//     const fetch = (await import('node-fetch')).default;
  
//     fetch('https://api.example.com')
//       .then(res => res.json())
//       .then(json => console.log(json))
//       .catch(err => console.error(err));
//   })();

const urlArraySchema = Joi.array().items(Joi.string().uri()).min(1).required();

app.use(cors());
app.use(express.json());

app.disable('x-powered-by');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.',
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress,
});

app.use(limiter);
app.post('/fetch-metadata', async (req, res) => {
  // Validate array of URLs
  const { error } = urlArraySchema.validate(req.body.urls);
  if (error) {
    return res.status(400).json({ error: `Invalid URL format: ${error.details.map(detail => detail.message).join(', ')}` });
  }

  try {
    const urls = req.body.urls;
    const fetch = (await import('node-fetch')).default;
    const metadataPromises = urls.map(async (url) => {
      try {
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
          timeout: 20000, // 20 seconds timeout
        });

        if (!response.ok) {
          return { url, error: `HTTP Error: ${response.status}` };
        }

        const html = await response.text();

        return {
          url,
          title: html.match(/<title>(.*?)<\/title>/)?.[1] || 'No title found',
          description: html.match(/<meta name="description" content="(.*?)"/i)?.[1] || 'No description found',
          image: html.match(/<meta property="og:image" content="(.*?)"/i)?.[1] || 'No image found',
        };
      } catch (error) {
        return { url, error: `Failed to fetch metadata: ${error.message}` };
      }
    });

    const metadata = await Promise.all(metadataPromises);
    res.json(metadata);
  } catch (error) {
    console.error('Error in /fetch-metadata route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.use(express.static(path.join(__dirname, "..",'client', 'build')));

// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, "..",'client', 'build', 'index.html'));
// });

// const PORT = process.env.PORT || 5000;
const PORT =  5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
