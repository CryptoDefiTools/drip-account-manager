import Modal from '../../components/partials/Modal';
import { useState, useEffect, useRef } from 'react';
import { alertIcon } from '../../components/partials/Alert';

const ConfirmationModal = ({ 
    modalState: state = 'CONFIRM',
    visible = false, 
    className,
    onConfirm,
    onClose,
    confirmationTitle = 'Are you sure?',
    confirmationContent = 'Do you want to proceed with this operation?',
    confirmText = 'Yes',
    cancelText = 'No',
    successTitle = 'Success!',
    successContent = 'Operation has been performed.',
    errorTitle = 'Error!',
    errorContent = 'Operation failed.',
}) => {
    const [modalState, setModalState] = useState(state);
    const [isModalVisible, setIsModalVisible] = useState(visible);

    const completeOperation = onConfirm || (() => setModalState('SUCCESS'));

    const closeModal = onClose || (() => setIsModalVisible(false));

    const btnRef = useRef(null);

    useEffect(() => {
        setIsModalVisible(visible);
        setModalState(state);
    }, [visible, state]);

    useEffect(() => {
        if (visible && btnRef.current !== null) {
            btnRef.current.focus();
        }
    })

    const states = {
        'CONFIRM': <>
            <div className="mx-auto mb-5 transform scale-150">
                {alertIcon('warning')}
            </div>
            <div className="text-center text-black">
                <div className="text-3xl font-semibold">{confirmationTitle}</div>
                <div className="mt-3">{confirmationContent}</div>
            </div>
            <div className="flex justify-center space-x-5 mt-8">
                <input type="button" 
                    onClick={completeOperation} 
                    className="px-4 py-2 text-sm font-medium text-white shadow bg-light-blue-500 focus:outline-none focus:ring rounded hover:bg-light-blue-600 hover:shadow-none"
                    ref={btnRef}
                    value={confirmText}
                />
                    
                <button 
                    onClick={closeModal} 
                    className="px-4 py-2 text-sm font-medium text-white shadow bg-gray-500 focus:outline-none focus:ring rounded hover:bg-gray-600 hover:shadow-none"
                >
                    {cancelText}
                </button>
            </div>
        </>,
        'ERROR': <>
            <div className="mx-auto mb-5 transform scale-150">
                {alertIcon('error')}
            </div>
            <div className="text-center text-black">
                <div className="text-3xl font-semibold">{errorTitle}</div>
                <div className="mt-3"> {errorContent}</div>
            </div>
            <button onClick={closeModal} className="mx-auto mt-8 px-7 py-2 text-sm font-medium text-white shadow bg-gray-500 focus:outline-none focus:ring rounded hover:bg-gray-600 hover:shadow-none">Cancel</button>
        </>,
        'SUCCESS': <>
            <div className="mx-auto mb-5 transform scale-150">
                {alertIcon('success')}
            </div>
            <div className="text-center text-black">
            <div className="text-3xl font-semibold">{successTitle}</div>
                <div className="mt-3"> {successContent}</div>
            </div>
            <button onClick={closeModal} className="mx-auto mt-8 px-7 py-2 text-sm font-medium text-white shadow bg-light-blue-500 focus:outline-none focus:ring rounded hover:bg-light-blue-600 hover:shadow-none">OK</button>
        </>,
    };

    return (
        <Modal 
            visible={isModalVisible} 
            onClose={closeModal} 
            title="" 
            className={className}
        >
            <div className="flex flex-col w-full pt-3">
                {states[modalState]}
            </div>
        </Modal>
    );
};

export default ConfirmationModal;