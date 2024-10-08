# Dynamic URL Metadata Fetcher

## Description

The Dynamic URL Metadata Fetcher is a web application that allows users to input multiple URLs and fetch metadata (such as title, description, and images) from these URLs. The app features a dynamic and interactive user interface with dark mode support.

## Features

- Dynamic URL Inputs: Users can add or remove URL input fields dynamically.
- Metadata Fetching: Fetch metadata for the provided URLs with a single click.
- Dark Mode: Toggle between light and dark modes for better user experience.
- Interactive Metadata Display: View metadata with hover and click effects.

## Design Choices

- Frontend:

  - React: Used for building the user interface and managing state.
  - React-Spring: Applied for animations and smooth transitions.
  - CSS: Used for styling, with support for dark mode.

- Backend:
  - Express: Used for the server and API endpoint.
  - Node-Fetch: Handles HTTP requests to fetch metadata.
  - Helmet: Provides security headers for the Express app.
  - Rate Limiting: Protects the API from excessive requests.

## Setup

Clone the repository:
"git clone "
server side:
-change the cors origin to localhost:3000

- navigate to index.js
- node .\index.js
  Post "/fetch-metadata" request body most contain
  {
  "urls": [
  "http://example.com",
  "http://anotherexample.com",
  "http://anotherexample.com"
  ]
  }

client side:
-change the fetch to the backend "localhost:5000"

- navigate to the front end -> cd urlapp
- npm install
- npm start
  look at the local domain: http://localhost:3000 (for now its on local host i will deploy it on the heruko)

this is in locals,
in the production you can visit "https://vercel-dep-client.vercel.app/" and this will redirect you to the front end

Design Trade-Offs
Frontend:
Responsiveness vs. Performance: Opted for a responsive design that adapts to various screen sizes, which may impact performance slightly due to animations.
Simplicity vs. Features: Chose a straightforward design to ensure ease of use and readability, potentially sacrificing some advanced features.

Backend:
Performance vs. Rate Limiting: Implemented rate limiting to prevent abuse, which may limit the number of requests for legitimate users.
Error Handling: Basic error handling is implemented for network errors and invalid URLs.

Contact
For any questions or feedback, please reach out to "omar.is1207@gmail.com"
