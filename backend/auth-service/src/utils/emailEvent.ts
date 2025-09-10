export type ResetEmailEvent = {
  type: "PASSWORD_RESET";
  payload: {
    email: string;
    fullName?: string | null;
    resetLink: string;
  };
};

export function buildResetEvent(email: string, resetLink: string, fullName?: string | null): ResetEmailEvent {
  return {
    type: "PASSWORD_RESET",
    payload: { email, fullName, resetLink }
  };
}
