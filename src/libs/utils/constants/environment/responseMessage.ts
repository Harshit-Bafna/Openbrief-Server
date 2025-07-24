export default {
    // General Messages
    SOMETHING_WENT_WRONG: 'Something Went Wrong.',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    NOT_FOUND: (entity: string) => `Not Found: ${entity}`,

    // Email Messages
    EMAIL_SENT: 'Email sent successfully',
    EMAIL_SENT_TO_MULTIPLE_USERS: 'Email sent to multiple users successfully',
    EMAIL_SENT_TO_GROUPS: 'Email sent successfully to all groups',

    // AWS S3 Messages
    UPLOAD_URL_GENERATED: 'Upload URL generated successfully',
    SIGNED_URL_FETCHED: 'Signed URL fetched successfully',
    FILE_DELETED: 'File deleted successfully'
}
