import { useState, useEffect } from 'react';
import cn from 'classnames';

const Modal = ({ visible = false, onClose, title, children, className }) => {
    const [isModalVisible, setIsModalVisible] = useState(visible);

    const hideModal = () => setIsModalVisible(false);

    useEffect(() => {
        setIsModalVisible(visible);
    }, [visible])

    return (
        <div 
            onClick={onClose || hideModal}
            className={cn('items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-600 bg-opacity-70 z-50', {
                'flex': isModalVisible,
                'hidden': !isModalVisible,
                ...className
            })}
        >
            <div className="bg-white rounded w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-2 z-50" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col items-start px-8 py-5 w-full">
                    <div className="flex items-center w-full">
                        <div className="text-gray-900 font-medium text-lg">{title}</div>
                        <svg onClick={onClose || hideModal} className="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                        </svg>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;