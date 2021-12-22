# drip-account-manager

Drip Account Manager helps you manage your DRIP accounts. 
It provides a simple and easy to use user interface to interact with the DRIP smart contracts without the need of using wallets such as metamask.

### How does it work?
1.  A single json file is used define all your accounts. 
2. You must provide all the necessary details in order for the application to pull and perform smart contract interaction. 
3. A accounts-sample.json is provided as a sample template. 

### Screenshots
![dashboard](images/dashboard.png)
![accounts](images/accounts.png)
![swap](images/swap.png)

### How do I run it?
1. Clone the repository
2. Create a accounts.json to define the accounts you want to manage
3. Install the dependencies and run the application
```
npm install
npm run dev
```

### Security
1. The accounts.json file never leaves your local machine.
2. The details defined in the accounts.json is never sent to some server to be stored. 
3. All the source codes are publicly available here on Github. 

### Contributing
1.  Fork the repository.
2.  Create a working branch and start with your changes!
3. Commit your update
4. When you're finished with the changes, create a pull request, also known as a PR
5. We will review your PR and merge them. 

### Donation
Wallet address: 0x65230E965BDc4CcD4402cdaBf64D3bD39F97a339
![qrcode](images/qrcode.png)