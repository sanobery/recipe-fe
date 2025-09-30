declare module '@hookform/resolvers/zod' {
    import { Resolver } from 'react-hook-form'
    import * as z from 'zod'
    export function zodResolver<T>(schema: z.ZodType<T>): Resolver<T>
}
