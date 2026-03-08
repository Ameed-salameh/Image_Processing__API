# Image Processing API

A Node.js Express API for image resizing with caching capabilities.

## Features

- Resize images with custom dimensions
- Automatic caching of resized images
- Comprehensive error handling
- TypeScript implementation
- Full test coverage

## Installation

```bash
npm install
```

## Usage

### Start the server

```bash
npm start
```

The server will start on `http://localhost:3000`

### API Endpoints

#### Health Check
```
GET /
```
Returns API status and available endpoints.

#### Image Resizing
```
GET /api/images?filename={name}&width={width}&height={height}
```

**Parameters:**
- `filename`: Name of the source image file (must exist in `assets/full/`)
- `width`: Target width in pixels (must be positive number)
- `height`: Target height in pixels (must be positive number)

**Example:**
```
GET /api/images?filename=example.jpg&width=200&height=200
```

**Response:**
- Success: Returns the resized image file
- Error: Returns JSON with error message and appropriate HTTP status code

## Error Handling

The API returns appropriate HTTP status codes for different error scenarios:

- `400`: Missing or invalid parameters
- `404`: Source image file not found
- `500`: Internal server error

## Caching

Resized images are automatically cached in the `assets/thumb/` directory. Subsequent requests for the same dimensions will serve the cached image directly.

## Development

### Available Scripts

```bash
# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Build TypeScript
npm run build

# Start server
npm start
```

### Project Structure

```
src/
├── server.ts           # Express server setup
├── routes/
│   └── images.ts       # Image API routes
├── utilities/
│   └── resizeImage.ts  # Image processing utility
└── tests/
    ├── apiSpec.ts      # API endpoint tests
    └── imageSpec.ts    # Image utility tests
```

## Dependencies

- **express**: Web framework
- **sharp**: Image processing library
- **typescript**: TypeScript compiler
- **jasmine**: Testing framework
- **supertest**: HTTP testing library
- **eslint**: Code linting
- **prettier**: Code formatting