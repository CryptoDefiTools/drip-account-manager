const fetch = require('node-fetch');

/**
 * Script template to act as a cron job that will trigger auto roll function.
 */

// TODO: create auto roll API service
// case 1: auto roll when claims is above > $100 and if BNB is above threshold
setInterval(async () => {
    try {
        const resp = await fetch('http://localhost:3000/api/hello', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await resp.json();
        console.log('final', result);
    } catch (error) {
        console.log(error);
    }
}, 3000);
