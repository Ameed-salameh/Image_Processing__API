# Image Processing API

This project is a simple API built with Node.js, Express, and TypeScript that allows users to resize images. The API reads images from a folder, resizes them based on the requested width and height, and then stores the resized version as a thumbnail.

To improve performance, the API uses on-disk caching. This means that if the same image size is requested again, the server will return the already generated thumbnail instead of resizing the image again.

The project is organized so that the TypeScript source code is inside the src folder, while the compiled JavaScript files are placed in the build folder. Tests are also included to verify both the API endpoints and the image processing functionality.

## Scripts

All commands should be run from the root of the project.

Install the project dependencies:

```bash
npm install
```

Build the TypeScript files into JavaScript:

```bash
npm run build
```

Run the test suite using Jasmine and SuperTest:

```bash
npm test
```

Run ESLint to check for code style issues:

```bash
npm run lint
```

Format the code using Prettier:

```bash
npm run format
```

Start the server after building the project:

```bash
npm start
```

The server runs from the compiled file:

```
build/server.js
```

which is generated from:

```
src/server.ts
```

## API Endpoints

The server runs by default on:

```
http://localhost:3000
```

### Health Check

**Method**

GET /

This endpoint simply returns a JSON response with a message confirming that the API is running. It also includes some basic information such as the version and an example endpoint.

### Resize Image

**Method**

GET

**Endpoint**

/api/images

**Example request:**

```
http://localhost:3000/api/images?filename=example.jpg&width=200&height=200
```

**Required Query Parameters**

- filename → name of the image file located inside images/full
- width → desired width in pixels
- height → desired height in pixels

### How it works

When the endpoint is called for the first time with a specific image and size:

1. The API reads the image from images/full.
2. The image is resized using the Sharp library.
3. The resized version is saved inside images/thumb.
4. The generated thumbnail is returned to the client.

If the same request is made again with the same parameters, the server will detect that the thumbnail already exists and return it directly instead of resizing the image again.

## Error Handling

The /api/images endpoint checks the input parameters and returns appropriate error responses.

### 400 Bad Request

This happens when:

- filename is missing
- width or height are missing
- width or height are not numbers
- width or height are zero or negative

### 404 Not Found

Returned when the requested image does not exist in the images/full folder.

### 500 Internal Server Error

Returned if something unexpected happens while processing the image.

All error responses are returned as JSON with an error message.

## Caching Behavior

Source images are stored in:

```
images/full
```

Generated thumbnails are stored in:

```
images/thumb
```

### To test the caching behavior:

1. Make sure there is an image called example.jpg inside images/full.
2. Remove any existing thumbnails for that image from images/thumb.
3. Start the server:

```bash
npm run build
npm start
```

4. Open the following URL in the browser:

```
http://localhost:3000/api/images?filename=example.jpg&width=200&height=200
```

**On the first request:**

A new file called example_200_200.jpg will be created in images/thumb.

**If you refresh the page multiple times:**

The server will reuse the existing thumbnail instead of generating a new one.

**If you delete the thumbnail again and repeat the request, a new one will be created.**

## Testing

The project includes tests for both the API and the image processing utility.

### API Tests

Located in:

```
src/tests/apiSpec.ts
```

These tests use SuperTest to send HTTP requests to the Express application.

They test:

- The root endpoint (GET /)
- A successful image resize request
- Various error scenarios such as missing parameters or non-existing images.

### Image Processing Tests

Located in:

```
src/tests/imageSpec.ts
```

These tests directly verify the resizeImage function located in:

```
src/utilities/resizeImage.ts
```

The tests check:

- Invalid input values
- Non-existing image files
- Successful image resizing
- Correct creation of thumbnails
- Reusing cached thumbnails on repeated requests.

Run all tests with:

```bash
npm test
```

## Project Structure

Main folders used in the project:

```
src/
```

Contains all TypeScript source files including the server, routes, utilities, and tests.

```
build/
```

Contains the compiled JavaScript files after running the build command.

```
images/full
```

Contains the original images used as input.

```
images/thumb
```

Contains generated thumbnails created by the API. These files can be safely deleted since they will be recreated when needed.