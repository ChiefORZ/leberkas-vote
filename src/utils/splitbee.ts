import splitbee from '@splitbee/web';

export const init = () => {
  if (process.env.NODE_ENV === 'production') {
    splitbee.init({
      apiUrl: '/_hive',
      scriptUrl: '/bee.js',
    });
  }
};

declare type Data = {
  [key: string]: string | number | boolean;
};

export const trackEvent = (
  event: string,
  data?: Data
): Promise<void> | void => {
  if (process.env.NODE_ENV === 'production') {
    return splitbee.track(event, data);
  }
};
