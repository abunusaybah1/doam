type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

const CODE_MESSAGES: Record<string, string> = {
  "23505": "That already exists — try a different value.",
  "23503":
    "This action can't be completed because it's linked to something else that still exists.",
  "23502": "Please fill in all required fields.",
  "22P02": "One of the values entered isn't in the right format.",
  "42501": "You don't have permission to do that.",
  "42P17": "Something went wrong on our end. Please try again in a moment.",
  PGRST116: "We couldn't find what you were looking for.",
  PGRST301: "You don't have permission to view this.",
};

const MESSAGE_PATTERNS: { match: RegExp; friendly: string }[] = [
  {
    match: /invalid login credentials/i,
    friendly: "Incorrect email or password.",
  },
  {
    match: /email not confirmed/i,
    friendly: "Please confirm your email before logging in.",
  },
  {
    match: /user registered/i,
    friendly: "An account with that email already exists.",
  },
  {
    match: /password should be at least/i,
    friendly: "Your password is too short.",
  },
  {
    match: /rate limit/i,
    friendly: "Too many attempts — please wait a moment and try again.",
  },
  {
    match: /jwt expired/i,
    friendly: "Your session has expired. Please log in again.",
  },
  {
    match: /network/i,
    friendly: "Couldn't connect. Check your internet connection and try again.",
  },
  {
    match: /infinite recursion/i,
    friendly: "Something went wrong on our end. Please try again in a moment.",
  },
];

export function getFriendlyErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";

  const err = error as SupabaseErrorLike;

  if (err.code && CODE_MESSAGES[err.code]) {
    return CODE_MESSAGES[err.code];
  }

  if (err.message) {
    const matched = MESSAGE_PATTERNS.find((p) => p.match.test(err.message!));
    if (matched) return matched.friendly;
  }

  // Fallback: don't show raw Postgres/Supabase internals to users
  return "Something went wrong. Please try again, or contact us if the issue persists.";
}
