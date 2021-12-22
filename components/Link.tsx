import { ReactNode, MouseEventHandler } from 'react';
import cn from 'classnames';

interface Props {
    className?: string;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset' | undefined;
}

export default ({
    className = '',
    children = 'Link',
    onClick = () => void 0,
    type = 'button',
}: Props) => (
    <button type={type} className={cn('link', className)} onClick={onClick}>
        {children}
    </button>
);
