import Button from './Button';
import { useState } from 'react';

export const RollComponent = (props) => {
    const [toggleRollButton, setToggleRollButton] = useState(false);

    async function roll(address, walletLevel) {
        console.log('roll action for ', address);
        setToggleRollButton(true);

        const gasPrice = await props.web3.eth.getGasPrice();
        console.log(gasPrice);
        const nonce = await props.web3.eth.getTransactionCount(address);

        const tx = props.dripContract.methods.roll();
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

        // https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#sendtransaction
        // getTransactionReceipt - to validate if transaction was mined or not
        // const receipt = null;

        if (receipt && receipt.transactionHash) {
            const transactionMined = await props.web3.eth.getTransactionReceipt(
                receipt.transactionHash
            );
            if (transactionMined) {
                console.log('final', result);
            }
        }
        setToggleRollButton(false);
    }

    return (
        <Button
            disabled={toggleRollButton}
            className="text-xs px-2 py-1 hover:bg-gray-200"
            onClick={(e) => {
                e.stopPropagation();

                if (window.confirm('Are you sure you wish to Roll?'))
                    roll(
                        props.account.address,
                        props.account.walletLevel,
                    );
            }}
        >
            Roll
        </Button>
    );
};
