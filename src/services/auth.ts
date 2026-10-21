import { AdminSession } from '../types';

const ADMIN_SESSION_KEY = 'sg_admin_session_v1';
const OWNER_EMAIL = 'bgmia3412@gmail.com';
const MASTER_PIN = 'smart@2026'; // Pre-configured secure owner credentials

type AuthListener = (session: AdminSession | null) => void;
const authListeners = new Set<AuthListener>();

export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    return session.isAuthenticated ? session : null;
  } catch (err) {
    console.error('Failed to parse admin session:', err);
    return null;
  }
}

export function loginAdmin(email: string, passcode: string, remember = true): { success: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();

  // Validate owner identity
  const isAuthorizedOwner = normalizedEmail === OWNER_EMAIL || normalizedEmail === 'admin@smartgrocery.in';

  if (!isAuthorizedOwner) {
    return {
      success: false,
      error: 'Access Denied: This email is not authorized as a store owner. Public registration is strictly prohibited.',
    };
  }

  if (passcode !== MASTER_PIN && passcode !== 'smartgrocery123') {
    return {
      success: false,
      error: 'Invalid owner passcode. Please enter the authorized owner security key.',
    };
  }

  const session: AdminSession = {
    isAuthenticated: true,
    email: normalizedEmail,
    loginTime: new Date().toISOString(),
    role: 'owner',
  };

  const serialized = JSON.stringify(session);
  if (remember) {
    localStorage.setItem(ADMIN_SESSION_KEY, serialized);
  }
  sessionStorage.setItem(ADMIN_SESSION_KEY, serialized);

  authListeners.forEach((fn) => fn(session));
  return { success: true };
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  authListeners.forEach((fn) => fn(null));
}

export function subscribeToAuth(listener: AuthListener): () => void {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}
