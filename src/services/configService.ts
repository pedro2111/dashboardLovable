declare global {
  interface Window {
    APP_CONFIG: {
      AUTH_API_URL: string;
      API_URL: string;
      CLIENT_ID: string;
      SERVICE_CLIENT_ID: string;
      SERVICE_CLIENT_SECRET: string;
      AUTH_REALM: string;
      FALLBACK_TOKEN: string;
    }
  }
}

export const config = {
  get AUTH_API_URL() {
    console.log(window.APP_CONFIG?.AUTH_API_URL);
    return window.APP_CONFIG?.AUTH_API_URL || 'https://login.des.caixa';
  },
  get API_URL() {
    return window.APP_CONFIG?.API_URL || 'http://localhost:3001/api';
  },
  get CLIENT_ID() {
    return window.APP_CONFIG?.CLIENT_ID || 'cli-web-pnc';
  },
  get SERVICE_CLIENT_ID() {
    return window.APP_CONFIG?.SERVICE_CLIENT_ID || 'cli-ser-gpf';
  },
  get SERVICE_CLIENT_SECRET() {
    return window.APP_CONFIG?.SERVICE_CLIENT_SECRET || '07c7b9c9-ee4e-4d22-a978-718d8727ebd4';
  },
  get AUTH_REALM() {
    return window.APP_CONFIG?.AUTH_REALM || 'intranet';
  },
  get FALLBACK_TOKEN() {
    return window.APP_CONFIG?.FALLBACK_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  }
};