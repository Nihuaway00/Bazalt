import minio from "#database/minio.js"

//docs: https://min.io/docs/minio/linux/developers/javascript/API.html#javascript-client-api-reference

class FileHandler {
    uploadBuffer = (Bucket, name, ContentType, Body) => {
        minio.putObject(
            Bucket,
            name,
            Body,
            { "Content-Type": ContentType },
            (err, data) => {
                if (err) return console.log(err)
                console.log("File uploaded!")
            }
        )
    }

    remove = (bucket, name) => {
        minio.removeObject(bucket, name, err => {
            if (err) return console.log(err)
            console.log("File removed!")
        })
    }

    removeMany = (bucket, nameList) => {
        minio.removeObjects(bucket, nameList, err => {
            if (err) return console.log(err)
            console.log("Files removed!")
        })
    }
}

export default new FileHandler()
