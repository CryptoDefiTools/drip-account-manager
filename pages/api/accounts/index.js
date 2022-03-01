let accounts = require('../../../data/accounts.json');

// Returns all defined local accounts in accounts.json
// Only returns ID, Account Name and Address

export default function handler(req, res) {
    const fetchedAccounts = [];

    for (const account of accounts) {
        try {
            fetchedAccounts.push({
                id: account.id,
                accountName: account.accountname,
                address: account.address,
            });
        } catch (error) {
            console.error('There is an issue with this account!', error);
        }
    }
    res.status(200).send(fetchedAccounts);
}
