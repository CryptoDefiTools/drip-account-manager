import { useState } from 'react';
import cn from 'classnames';
import ExpandIcon from './Icons/ChevronDown';
import CollapseIcon from './Icons/ChevronUp';

const CollapsibleTableRow = ({ rowkey, rowContent, collapsibleContent }) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <>
            <tr
                key={rowkey}

            >
                {rowContent}
                <td>
                    <div className=" flex justify-center h-full items-center pr-3">
                        <button
                            title={collapsed ? 'Show Details' : 'Hide Details'}
                            className="cursor-pointer"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            { collapsed ? <ExpandIcon/> : <CollapseIcon/> }
                        </button>
                    </div>
                </td>
            </tr>
            <tr
                key={rowkey + 'b'}
                className={cn('bg-gray-50 dark:bg-gray-700', {
                    hidden: collapsed,
                })}
            >
                {collapsibleContent}
            </tr>
        </>
    );
};

export default CollapsibleTableRow;
