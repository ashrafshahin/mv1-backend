const { z } = require('zod')

// Registration schema validation
const registrationSchemaValidation = z.object({
    name: z.string()
        .min(2, { message: 'Name must be atleast 2 characters...' })
        .max(50, { message: 'Name too long, max 50 characters...' })
        .trim(),

    email: z.string()
        .email({ message: 'Invalid Email...' })
        .lowercase()
        .trim(),

    password: z.string()
        .min(8, { message: 'password must be atleast 8 characters...' })
        .trim()
        .regex(/[a-z]/, { message: 'Lowecase charecter required...' })
        .regex(/[A-Z]/, { message: 'Uppercase charecter required...' })
        .regex(/[0-9]/, { message: 'Must have a number...' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Must contain a Special charater...' }),

    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number. Use international format (e.g., +1234567890)' })
        .optional(),

    role: z.enum(['customer', 'vendor', 'admin'], { message: 'Invalid Role request...' })
        .default('customer')
        .optional(),

})

// Login schema validation
const loginSchemaValidation = z.object({
    email: z.string()
        .email({ message: 'Invalid Email...' })
        .lowercase()
        .trim(),

    password: z.string()
        .min(8, { message: 'password must be atleast 8 characters...' })
        .trim()
        .regex(/[a-z]/, { message: 'Lowecase charecter required...' })
        .regex(/[A-Z]/, { message: 'Uppercase charecter required...' })
        .regex(/[0-9]/, { message: 'Must have a number...' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Must contain a Special charater...' }),

})


module.exports = { registrationSchemaValidation, loginSchemaValidation }