export const environment = {
  production: true,
  externalServices: (window as any).env.externalServices || {},
  mdrConfig: (window as any).env.mdrConfig || {},
  molgenisCredentials: (window as any).env.molgenisCredentials || {},
};
