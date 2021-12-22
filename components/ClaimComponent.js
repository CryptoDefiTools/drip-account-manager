import Button from './Button';
import { useState } from 'react';

export const ClaimComponent = (props) => {
    const [toggleRollButton, setToggleRollButton] = useState(false);

    async function claim(address) {
        console.log('claim action for ', address);
        setToggleRollButton(true);

        const gasPrice = await props.web3.eth.getGasPrice();
        console.log(gasPrice);
        const nonce = await props.web3.eth.getTransactionCount(address);

        const tx = props.dripContract.methods.claim();
        const gas = await tx.estimateGas({ from: address });
        console.log('GAS: ', gas);
        const data = tx.encodeABI();

        const txData = {
            from: address,
            to: props.dripContractAddress,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: 56,
        };

        const receipt = await props.web3.eth.sendTransaction(txData);
        console.log(receipt);
        setToggleRollButton(false);
    }

    return (
        <Button
            disabled={toggleRollButton}
            className="text-xs px-2 py-1 hover:bg-gray-200"
            onClick={(e) => {
                e.stopPropagation();

                if (window.confirm('Are you sure you wish to Claim?'))
                    claim(props.account.address);
            }}
        >
            Claim
        </Button>
    );
};
