export const environment = {
  production: true,
  externalServices: (window as any).env.externalServices || {},
  mdrConfigGBN: (window as any).env.mdrConfigGBN || {},
  mdrConfigCCDG: (window as any).env.mdrConfigCCDG || {},
  molgenisCredentials: (window as any).env.molgenisCredentials || {},
};
