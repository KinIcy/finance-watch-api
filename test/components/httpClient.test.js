const HttpClient = require('../../components/httpClient');
const assert = require('assert');

async function test() {
  const client = new HttpClient();

  console.log('The HTTP Client')
  
  console.log('\t should successfully do a GET request')
  await client.get('https://jsonplaceholder.typicode.com/todos/1').then((res) => {
    assert.notEqual(res, undefined);
    assert.equal(typeof res.data, 'string');
    console.log('OK')
  })

  console.log('\t should successfully do a GET request with json response')
  await client.get('https://jsonplaceholder.typicode.com/todos/1', { json: true }).then((res) => {
    assert.notEqual(res, undefined);
    assert.notEqual(typeof res.data, 'string');
    assert.notEqual(res.data.title, undefined);
    console.log('OK')
  })
}

module.exports = test;