import { S3Client } from '@aws-sdk/client-s3'
import { environment } from '../../utils/constants'

const bucketRegion = environment.BUCKET_REGION
const accessKey = environment.ACCESS_KEY
const secretAccessKey = environment.SECRET_ACCESS_KEY

const S3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})

export default S3
