// authSteps.js — the auth flow step registry (from Zucci Auth.html STEPS).
// Each step maps to a screen component name resolved in AuthFlow.vue.

export const STEP_GROUPS = [
  {
    group: 'Sign in',
    items: [
      { id: 'signin-id', n: '01', label: 'Identify', screen: 'SignInIdentity' },
      { id: 'signin-pw', n: '02', label: 'Password', screen: 'SignInPassword' },
      { id: 'signin-pw-err', n: '03', label: 'Wrong password', screen: 'SignInPasswordError' },
      { id: 'signin-locked', n: '04', label: 'Locked out', screen: 'SignInLocked' },
    ],
  },
  {
    group: 'OTP',
    items: [
      { id: 'otp', n: '05', label: 'Authenticator', screen: 'OtpEnter' },
      { id: 'otp-backup', n: '07', label: 'Backup code', screen: 'OtpBackup' },
    ],
  },
  {
    group: 'Recover',
    items: [
      { id: 'forgot', n: '11', label: 'Forgot password', screen: 'ForgotRequest' },
      { id: 'forgot-sent', n: '12', label: 'Link sent', screen: 'ForgotSent' },
      { id: 'reset', n: '13', label: 'Reset password', screen: 'ResetPassword' },
    ],
  },
  {
    group: 'Other',
    items: [
      { id: 'trust', n: '15', label: 'Trust device', screen: 'TrustDevice' },
    ],
  },
];

export const ALL_STEPS = STEP_GROUPS.flatMap((g) => g.items);
export const findStep = (id) => ALL_STEPS.find((s) => s.id === id) || ALL_STEPS[0];
