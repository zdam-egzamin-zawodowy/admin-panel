import { CDN_URI } from 'config/cdn';

const buildURL = (type: 'cdn', str: string): string => {
  switch (type) {
    case 'cdn':
      return CDN_URI + str;
  }
  return str;
};

export default buildURL;
