import cn from 'classnames';

const Button = ({
    className = '',
    children = 'Button',
    onClick = () => void 0,
    type = 'button',
    disabled = false
}) => (
    <button type={type} disabled={disabled} className={cn('btn', className)} onClick={onClick}>
        {children}
    </button>
);

export default Button;
