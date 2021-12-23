import { useState } from 'react';
import QRCode from 'react-qr-code';
import QR from './icons/QR';
import Modal from './Modal';

const Donate = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <>
            <div className="text-xs flex items-middle justify-end space-x-3 pt-3">
                <span>Show us some love: </span>
                <span className="font-semibold">0x65230E965BDc4CcD4402cdaBf64D3bD39F97a339</span>
                <button onClick={() => setIsModalVisible(true)}>
                    <QR />
                </button>
            </div>
            <Modal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                title="Scan QR"
            >
                <div className="flex justify-center w-full my-5">
                    <QRCode value="0x65230E965BDc4CcD4402cdaBf64D3bD39F97a339" />
                </div>
            </Modal>
        </>
    );
}

export default Donate;
