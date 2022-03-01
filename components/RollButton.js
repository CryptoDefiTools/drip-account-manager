import { useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import Button from './Button';
import ConfirmationModal from './partials/ConfirmationModal';
import { toast } from 'react-toastify';
import ellipsisInBetween from '../utils/ellipsisInBetween';

export const RollButton = props => {
    // Confirmation modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState('CONFIRM');
    const { address } = props.account;

    const {
        isLoading,
        mutateAsync,
    } = useMutation(address => axios.get(`/api/actions/roll?address=${address}`), {
        // retry: false,
    });

    const roll = () => mutateAsync(address);

    const notify = () => toast.promise(
        roll,
        {
            pending: {
                render() {
                    return (<div>Rolling for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
            success: {
                render() {
                    return (<div>Roll successful for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
            error: {
                render() {
                    return (<div>Roll failed for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
        }
    )

    return (
        <>
            <Button
                disabled={isLoading}
                className="text-xs px-2 py-1 hover:bg-gray-200 disabled:opacity-50"
                onClick={(e) => {
                    e.stopPropagation();

                    setModalState('CONFIRM');
                    setIsModalVisible(true);
                }}
            >
                Roll
            </Button>

            <ConfirmationModal
                modalState={modalState}
                visible={isModalVisible}
                onConfirm={() => {
                    // mutate(address);
                    notify();
                    setIsModalVisible(false);
                }}
                onClose={() => setIsModalVisible(false)}
                confirmationContent={<div className="break-all w-full">Do you really wish to Roll for <br /><span className="font-semibold">{address}</span>?</div>}
                successContent="Roll Successful!"
                errorContent="Something went wrong."
            />
        </>
    );
};
