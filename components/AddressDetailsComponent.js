import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyIcon from './Icons/Duplicate';
import ellipsisInBetween from '../utils/ellipsisInBetween';

export const AddressDetailsComponent = ({account, showFullAddress = false}) => {
    return (
        <div className="flex flex-col">
            <div className="flex space-x-2">
                <span className="font-semibold text-sky-500 dark:text-blue-300">{showFullAddress ? account.address : ellipsisInBetween(account.address)}</span>
                <CopyToClipboard text={account.address} aria-label="Copy to Clipboard" className="focus:outline-none cursor-pointer hover:opacity-80">
                    <button title="Copy to Clipboard">
                        <CopyIcon className="w-4" />
                    </button>
                </CopyToClipboard>
            </div>

            {/* <div className="flex space-x-8">
                <span className="text-xs">
                    Wallet Level: {account.walletLevel}
                </span>
                <span className="text-xs">
                    Roll Count: {account.rollCount}
                </span>
            </div> */}
        </div>
    );
};
