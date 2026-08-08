import { User } from '../types';

export const ADMIN_EMAIL = 'arif.mia02@uttarauniversity.edu.bd';
export const ADMIN_PASSWORD = 'Ss6580765807@';

const USERS_STORAGE_KEY = 'engineer_arif_users_v2';
const SESSION_STORAGE_KEY = 'engineer_arif_session_v2';

const INITIAL_ADMIN: User = {
  id: 'usr-admin-01',
  name: 'MD Arif Mia',
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  role: 'admin',
  createdAt: new Date().toISOString(),
  phone: '01568647919'
};

export const authStore = {
  getUsers(): User[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([INITIAL_ADMIN]));
        return [INITIAL_ADMIN];
      }
      const users: User[] = JSON.parse(stored);
      // Ensure admin user always exists with the required credentials
      const adminExists = users.some(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
      if (!adminExists) {
        const updated = [...users, INITIAL_ADMIN];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
      return users;
    } catch (e) {
      console.error('Error reading users from storage', e);
      return [INITIAL_ADMIN];
    }
  },

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading session', e);
      return null;
    }
  },

  login(emailInput: string, passwordInput: string): { success: boolean; user?: User; error?: string } {
    const cleanEmail = emailInput.trim().toLowerCase();
    const users = this.getUsers();

    // Check if trying to login as admin
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      if (passwordInput === ADMIN_PASSWORD) {
        const adminUser: User = {
          id: 'usr-admin-01',
          name: 'MD Arif Mia (Admin)',
          email: ADMIN_EMAIL,
          role: 'admin',
          createdAt: new Date().toISOString(),
          phone: '01568647919'
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      } else {
        return { success: false, error: 'Incorrect password for Admin account.' };
      }
    }

    // Normal user login
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address. Please register first.' };
    }

    if (found.password !== passwordInput) {
      return { success: false, error: 'Invalid password. Please check and try again.' };
    }

    // Logged in as normal user (role: 'user')
    const sessionUser: User = { ...found, role: 'user' };
    delete sessionUser.password;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  },

  register(name: string, emailInput: string, passwordInput: string, phone?: string): { success: boolean; user?: User; error?: string } {
    const cleanEmail = emailInput.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    // Determine role: strictly admin ONLY if email matches arif.mia02@uttarauniversity.edu.bd
    const isAdminEmail = cleanEmail === ADMIN_EMAIL.toLowerCase();
    if (isAdminEmail && passwordInput !== ADMIN_PASSWORD) {
      return { success: false, error: `To register as Admin, you must set the password as required.` };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: passwordInput,
      role: isAdminEmail ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      phone: phone || ''
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  },

  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  updateProfile(userId: string, updatedData: Partial<User>): { success: boolean; user?: User; error?: string } {
    try {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === userId);
      
      const currentUser = this.getCurrentUser();
      if (!currentUser) return { success: false, error: 'No active session found.' };

      // Update in users array if found
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedData };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      // Update current session
      const newSessionUser: User = { ...currentUser, ...updatedData };
      delete newSessionUser.password;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSessionUser));

      return { success: true, user: newSessionUser };
    } catch (e) {
      console.error('Error updating profile', e);
      return { success: false, error: 'Failed to update profile.' };
    }
  },

  changePassword(userId: string, currentPass: string, newPass: string): { success: boolean; error?: string } {
    try {
      const users = this.getUsers();
      const currentUser = this.getCurrentUser();
      
      if (!currentUser) return { success: false, error: 'No active session found.' };

      const userIndex = users.findIndex(u => u.id === userId || u.email.toLowerCase() === currentUser.email.toLowerCase());
      
      if (userIndex !== -1) {
        const storedUser = users[userIndex];
        if (storedUser.password && storedUser.password !== currentPass) {
          return { success: false, error: 'Current password does not match.' };
        }
        users[userIndex].password = newPass;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      return { success: true };
    } catch (e) {
      console.error('Error changing password', e);
      return { success: false, error: 'Failed to update password.' };
    }
  },

  isAdmin(user: User | null): boolean {
    if (!user) return false;
    return user.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }
};
