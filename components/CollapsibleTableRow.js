import { useState } from 'react';
import cn from 'classnames';
import ExpandIcon from './Icons/ChevronDown';
import CollapseIcon from './Icons/ChevronUp';
import Button from './Button';

const CollapsibleTableRow = ({ rowkey, rowContent, actionsContent, collapsibleContent }) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <>
            <tr><td className="border-gray-100 dark:border-black p-2" colSpan={4}></td></tr>
            <tr
                key={rowkey}

            >
                {rowContent}
            </tr>
            <tr
                key={rowkey + '-actions'}
                className="table-actions"
            >
                <td className={cn('table-data bg-gray-50 dark:bg-gray-800', {
                    'rounded-b-4xl': collapsed,
                })} colSpan={7}>
                    <div className="table-controls">
                        {actionsContent}
                        <Button
                            title={collapsed ? 'Show Details' : 'Hide Details'}
                            className="table-action-button"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {
                                collapsed
                                    ? <>
                                        Expand
                                        <ExpandIcon className="ml-2 marker:w-4 h-4" />
                                    </>
                                    : <>
                                        Collapse
                                        <CollapseIcon className="ml-2 marker:w-4 h-4" />
                                    </>
                            }
                        </Button>
                    </div>
                </td>
            </tr>
            <tr
                key={rowkey + '-collapsed'}
                className={cn('table-actions bg-gray-50 dark:bg-gray-800', {
                    'hidden': collapsed,
                })}
            >
                {collapsibleContent}
            </tr>
        </>
    );
};

export default CollapsibleTableRow;
