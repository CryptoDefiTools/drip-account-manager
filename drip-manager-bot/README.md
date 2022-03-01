# drip-manager-bot

### About 
This is a bot that continously run on the background. It is intended to perform auto roll / auto claim strategy on the drip network. It works alongside drip-manager.

### install node & yarn
```bash
# install nvm (https://github.com/nvm-sh/nvm#installing-and-updating)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
# go to project, open terminal, install node version (this installs node version defined in .nvmrc)
nvm install
nvm use
# install yarn via npm
npm install -g yarn
yarn -v
```

### run drip-manager-bot
```bash
# make sure all dependencies are installed
yarn install
# run drip-manager-bot (make sure that the drip-manager is running)
yarn start-bot
# audit dependencies
yarn audit
```

### Available Stagegies

1. alternatingRollClaimStrategy
"botStrategy": "alternatingRollClaimStrategy",
"availableClaimDollarThreshold": 10,
"nextAction": "claim",

2. alternatingRollClaimSwapStrategy
"botStrategy": "alternatingRollClaimStrategy",
"availableClaimDollarThreshold": 10,
"nextAction": "claim",

3. alternatingRollClaimSwapPercentageStrategy
"botStrategy": "alternatingRollClaimSwapPercentageStrategy",
"thresholdPercentage": 1,
"nextAction": "claim"

4. alternatingRollClaimSwapRatioPercentageStrategy
"botStrategy": "alternatingRollClaimSwapRatioPercentageStrategy",
"thresholdPercentage": 1,
"rollClaimRatio": 2, // 2 roll,1 claim/swap 
"rollClaimRatioCounter": 2 // 

5. continuousRollStrategy
"botStrategy": "continuousRollStrategy",
"availableClaimDollarThreshold": 10

6. continuousRollPercentageStrategy
"botStrategy": "continuousRollPercentageStrategy",
"thresholdPercentage": 1
