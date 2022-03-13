const axios = require('axios');

// default headers
const commonHeaders = {
  'Content-Type': 'application/json',
};

function prepareRequest({ headers }) {
  return { headers: Object.assign(commonHeaders, headers) };
}

function errorHandler(e) {
  if (e.response) {
    return Promise.resolve(e.response)
  } else {
    return Promise.reject(e)
  }
}

function get(url, headers = {}) {
  return axios
    .get(url, prepareRequest({ headers }))
    .catch(errorHandler);
}

function post(url, data, headers = {}) {
  const prepHeaders = prepareRequest({ headers });
  return axios
    .post(url, data, prepHeaders)
    .catch(errorHandler);
}

async function put(url, data, headers = {}) {
  return axios
    .put(url, data, prepareRequest({ headers }))
    .catch(errorHandler);
}

async function patch(url, data, headers = {}) {
  return axios
    .patch(url, data, prepareRequest({ headers }))
    .catch(errorHandler);
}

async function del(url, data, headers = {}) {
  return axios
      .delete(url, prepareRequest({ headers }))
      .catch(errorHandler);
}

module.exports = {
  get,
  post,
  put,
  patch
}
