# Voile

SPA built with React on a Koa.js backend for serving comic books and other image galleries.

## Getting Started

In a `.env` file specify an SSL_KEY, SSL_CERT, and ARCHIVE_DIR. SSL setup can be omitted by modifying `index.js` to use Node's `http` module instead of `https`.

The archive directory can have any number of gallery folders. Each folder can have several chapters, which must be named starting from 1. Note that special decimal chapters are allowed, such as a "3.5" chapter. Each chapter folder must contain images named starting from 1, with no padding.

Each gallery folder must have a `metadata.json` in the following format. Properties ending with `?` are optional.

```
{
    "name": "Gallery name",
    "description?": "Gallery description"
    "id": "UNIQUE_ID",
    "tags?": {
        "language?": string[]
        "category?": string[]
        "group?": string[]
        "artist?": string[]
        "parody?": string[]
        "character?": string[]
        "content?": string[]
    }
}
```

Run `npm run build` to build the files in `src` manually. The resulting bundle will show in `dist/`

Run `node index.js` to start the server. It should run at https://localhost unless the server was modified to not use https.

Run `npm run dev` to start a development server with HMR preconfigured

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
