import { ReactNode } from 'react';
import cn from 'classnames';

interface Props {
    className: string;
    children: ReactNode;
}

export default ({ className = '', children = 'No results found.' }: Props) => (
    <div
        className={cn(
            'bg-white shadow rounded-md text-gray-600 text-sm p-5',
            className
        )}
    >
        {children}
    </div>
);
