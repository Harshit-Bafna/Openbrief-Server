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
    FILE_DELETED: 'File deleted successfully',

    // Fetching data
    FETCH_SUCCESS_LIST: (entity: string) => `${entity} list fetched successfully.`,
    FETCH_ERROR_LIST: (entity: string) => `${entity} list fetching failed.`,
    FETCH_SUCCESS: (entity: string) => `${entity} has been fetched successfully.`,

    // Create, Update and Delete Messages
    CREATE_SUCCESS: (entity: string) => `${entity} created successfully.`,
    UPDATE_SUCCESS: (entity: string) => `${entity} updated successfully.`,
    DELETE_SUCCESS: (entity: string) => `${entity} deleted successfully.`,
    ALREADY_EXISTS: (entity: string, withEntity?: string) => `${entity} already exists${withEntity ? ' with ' + withEntity : ''}.`,

    // Validation Messages
    INVALID_TYPE: (field: string, type: string) => `Invalid type for ${field}. Expected ${type}.`,
    REQUIRED_FIELD: (field: string) => `${field} is a required field.`,
    MIN_VALUE: (field: string, value: number) => `${field} must be at least ${value}.`,
    MAX_VALUE: (field: string, value: number) => `${field} must not exceed ${value}.`,
    MAX_LENGTH: (field: string, length: number) => `${field} must not exceed ${length} characters.`,
    MIN_LENGTH: (field: string, length: number) => `${field} must be at least ${length} characters long.`,

    // Other
    PASSWORD_ENCRYPTION_ERROR: 'An unknown error occurred while encrypting the password'
}
