// Options for serving static resources
export default {
  maxage: 31536000000, // 1 year
  extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  root: process.env.ARCHIVE_DIR
}
