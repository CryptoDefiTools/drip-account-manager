import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyIcon from './Icons/Duplicate';
import QRCode from 'react-qr-code';
import QR from './icons/QR';
import Modal from './partials/Modal';

const Donate = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const address = '0x65230E965BDc4CcD4402cdaBf64D3bD39F97a339';

    return (
        <>
            <div className="text-xs flex items-middle justify-end space-x-2 pt-3">
                <span>Show us some love: </span>
                <span className="font-semibold">{address}</span>
                <CopyToClipboard text={address} aria-label="Copy to Clipboard" className="focus:outline-none cursor-pointer hover:opacity-80">
                    <button title="Copy to Clipboard">
                        <CopyIcon className="w-4" />
                    </button>
                </CopyToClipboard>
                <button onClick={() => setIsModalVisible(true)} title="Show QR">
                    <QR className="w-4"/>
                </button>
            </div>
            <Modal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                title="Scan QR"
            >
                <div className="flex justify-center w-full my-8">
                    <QRCode value={address} />
                </div>
            </Modal>
        </>
    );
}

export default Donate;
