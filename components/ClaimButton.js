import { useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import Button from './Button';
import ConfirmationModal from './partials/ConfirmationModal';
import { toast } from 'react-toastify';
import ellipsisInBetween from '../utils/ellipsisInBetween';

export const ClaimButton = props => {
    // Confirmation modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState('CONFIRM');
    const { address } = props.account;

    const {
        isLoading,
        mutateAsync,
    } = useMutation(address => axios.get(`/api/actions/claim?address=${address}`), {
        // retry: false,
    });

    const claim = () => mutateAsync(address);

    const notify = () => toast.promise(
        claim,
        {
            pending: {
                render() {
                    return (<div>Claiming for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
            success: {
                render() {
                    return (<div>Claim successful for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
            error: {
                render() {
                    return (<div>Claim failed for <strong className="break-all">{ellipsisInBetween(address)}</strong></div>)
                },
            },
        }
    )

    return (
        <>
            <Button
                disabled={isLoading}
                className="table-action-button"
                onClick={(e) => {
                    e.stopPropagation();

                    setModalState('CONFIRM');
                    setIsModalVisible(true);
                }}
            >
                Claim
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
                confirmationContent={<div className="break-all w-full">Do you really wish to Claim for <br /><span className="font-semibold">{address}</span>?</div>}
                successContent="Claim Successful!"
                errorContent="Something went wrong."
            />
        </>
    );
};
