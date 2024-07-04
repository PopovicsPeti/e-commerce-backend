//Authorization: Basic UG9wb3ZpY3NQZXRpOlRFU1RfUEFTU1dPUkQ=

const username = 'PopovicsPeti';  // Replace with actual GitHub login
const password = process.env.PopovicsPeti;
const encoded = btoa(`${username}:${password}`);
console.log(`Authorization: Basic ${encoded}`);