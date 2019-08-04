# Voile

SPA built with React on a Koa.js backend for serving comic books and other image galleries.

## Getting Started

In a `.env` file specify an SSL_KEY, SSL_CERT, and ARCHIVE_DIR. SSL setup can be omitted by modifying `index.js` to use Node's `http` module instead of `https`.

In the archive directory can be several folders, each their own gallery. Images must be named starting from 1, with no padding and consistent file extensions (i.e. 1.jpg, 2.jpg, ..., n.jpg). Each gallery folder must have a `metadata.json` in the following format:

```
{
    "id": "UNIQUE_ID",
    "totalPages": 10,
    "name": "Name of gallery"
}
```

Run `npm install` to install dependencies

Run `npm install -D` to install dev dependencies

Run `npm run build` to build the files in `src` manually. The resulting bundle will show in `dist/`

Run `node index.js` to start the server. It should run at https://localhost unless the server was modified to not use https.

Run `npm prune` to remove dev dependencies

Run `npm run dev` to have webpack continually rebuild the frontend files in `src/`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
