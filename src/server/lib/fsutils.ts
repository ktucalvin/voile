import fs, { ReadStream } from 'fs'

export class FsUtils {
  static ensureDir (path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, { recursive: true }, err =>
        (err && err.code !== 'EEXIST')
          ? reject(err)
          : resolve()
      )
    })
  }

  static createReadStream (path: string): Promise<ReadStream> {
    return new Promise((resolve, reject) => {
      const stream: ReadStream = fs.createReadStream(path)
        .on('error', reject)
        .on('ready', () => resolve(stream))
    })
  }
}
