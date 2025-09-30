import TextField from '@mui/material/TextField'
import { FieldErrors, UseFormRegister, FieldValues, Path } from 'react-hook-form'

interface TextFieldProps<T extends FieldValues> {
    label: string
    name: Path<T>
    type?: string
    register: UseFormRegister<T>
    errors: FieldErrors<T>
    rules?: object
}

const CustomField = <T extends FieldValues>({
    label,
    name,
    register,
    errors,
    rules,
    ...rest
}: TextFieldProps<T>) => {
    return (
        <TextField
            fullWidth
            label={label}
            variant="outlined"
            margin="normal"
            {...register(name, rules)}
            error={!!errors[name]}
            helperText={errors[name]?.message as string}
            {...rest}
        />
    )
}

export default CustomField
