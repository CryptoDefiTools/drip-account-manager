import cn from 'classnames';

const Input = ({
    type = 'text',
    className = '',
    hasError = false,
    autoComplete = 'off',
    autoCapitalize = 'off',
    isLoading = false,
    disabled = false,
    placeholder = '',
    ...rest
}) => (
    <input
        type={type}
        className={cn('form-input', {
            'border-red-400 outline-none shadow-none': hasError,
            'border-gray-50 bg-gray-50 cursor-not-allowed':
                isLoading || disabled,
            className,
        })}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        placeholder={isLoading ? 'Loading...' : placeholder}
        disabled={disabled || isLoading}
        {...rest}
    />
);

export default Input;
