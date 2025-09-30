// =============================================
// Constant Messages
// =============================================
// - Centralized repository for reusable messages
// - Helps maintain consistency across the application
// - Reduces hardcoding of strings in multiple files
// - Makes updates easier (change once, reflect everywhere)
// - Supports better maintainability and localization
// =============================================

export const ConstantMessages = {
    PREP_TIME_NUMBERS_ONLY: 'Only numbers are allowed',
    PREP_TIME_MIN: 'Preparation time must be at least 1 minute',
    PREP_TIME_MAX: 'Preparation time cannot exceed 100 minutes',
    IMAGE_INVALID: 'Only JPEG, JPG, or PNG files are allowed',
    IMAGE_INVALID_FILE: 'Image is not a valid file object',
    UNEXPECTED_ERROR: 'An unexpected error occurred',
    PASSWORD_LENGTH: 'Password must be between 8 to 16 characters long.',
    PASSWORD_UPPERCASE: 'Password must include one uppercase letter.',
    PASSWORD_LOWERCASE: 'Password must include one lowercase letter.',
    PASSWORD_DIGIT: 'Password must include one number.',
    PASSWORD_SPECIALCASE: 'Password must include one special character.',
    VALID_RATING_COMMENT: 'Please provide a valid rating or comment.',
    NO_RECIPE: 'No Recipes Found.',
}

type MessageType = 'required' | 'invalid' | 'success'

export const getMessage = (field: string, type: MessageType) => {
    switch (type) {
        case 'required':
            return `${capitalize(field)} is required`
        case 'invalid':
            return `Invalid ${field} format`
        case 'success':
            return `${capitalize(field)} submitted successfully`
        default:
            return `${capitalize(field)} is invalid`
    }
}

// Helper to capitalize first letter
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
