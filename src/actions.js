const { S3RemoteUploader } = require('./helpers')

const actionHandler = async (url = '') => {
  return new Promise((resolve, reject) => {
    const fileUpload = new S3RemoteUploader(url)

    fileUpload
      .dispatch()
      .then(r => {
        resolve({ url: r.Location })
      })
      .catch(er => {
        reject(er)
      })
  })
}

module.exports = { actionHandler }
