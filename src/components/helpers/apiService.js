import axios from 'axios';
import {keys, isEmpty} from 'lodash';

const generateParams = (defaultParams, params) => {
  const paramKeys = keys(defaultParams).concat(keys(params));
  return paramKeys.map(key => `${key}=${params[key] || defaultParams[key]}`).join('&');
};

const generateUrl = (origin, service, pathParams, params) => {
  let url = `${service.url}`;
  if (service.pathParams) {
    keys(service.pathParams).forEach(key => {
      const value = pathParams[key] || service.pathParams[key];
      url = url.replace(`{${key}}`, value);
    });
  }

  return `${origin}${url}?${generateParams(service.defaultParams, params)}`;
};

const sendRequest = (origin, service, pathParams, params) => {
  pathParams = pathParams || {};
  params = params || {};
  if (service && service.url &&
      (isEmpty(service.pathParams) || keys(service.pathParams)
        .filter(key => service.pathParams[key] && pathParams[key]).length === 0)) {
    return axios.get(generateUrl(origin, service, pathParams, params));
  }
  return Promise.reject();
};

export default sendRequest;
