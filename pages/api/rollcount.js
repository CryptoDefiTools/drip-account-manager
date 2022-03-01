let accounts = require('../../data/accounts.json');
const fs = require('fs');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' });
        return;
    }

    let { address, rollCount } = req.body;
    const account = accounts.find((x) => x.address === address);

    if (!account) {
        res.status(400).send({ message: 'Account not found' });
        return;
    }

    account.rollCount = rollCount;
    Object.assign(account, account);
    fs.writeFileSync('data/accounts.json', JSON.stringify(accounts, null, 2));
    res.status(200).json({ message: `${address} Roll count updated!` });
}
