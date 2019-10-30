const stream = require('stream')
const axios = require('axios')
const AWS = require('aws-sdk')
const filenamify = require('filenamify')

class S3RemoteUploader {
  constructor (url) {
    this.url = url
    this.stream = stream
    this.axios = axios
    this.AWS = AWS
    this.AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY
    })
    this.s3 = new this.AWS.S3()
    this.fileName = filenamify(this.url, { replacement: '-' })
    this.objKey = `upload-url-to-s3/${this.fileName}`
    this.contentType = 'application/octet-stream'
    this.uploadStream()
  }

  uploadStream () {
    const pass = new this.stream.PassThrough()
    this.promise = this.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: this.objKey,
        Body: pass,
        ContentType: this.contentType
      })
      .promise()
    return pass
  }

  initiateAxiosCall () {
    return axios({
      method: 'get',
      url: this.url,
      responseType: 'stream'
    })
  }

  async dispatch () {
    await this.initiateAxiosCall().then(response => {
      if (response.status === 200) {
        this.contentType = response.headers['Content-Type']
        response.data.pipe(this.uploadStream())
      }
    })
    return this.promise
  }
}
module.exports = {
  S3RemoteUploader: S3RemoteUploader
}
