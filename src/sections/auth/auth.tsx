// import { createContext, useContext, useState, useEffect } from 'react';

// interface Admin {
//   displayName: string;
//   email: string;
//   phone?: string; // Made optional to match AccountPopover
//   photoURL?: string; // Made optional to match AccountPopover
// }

// interface AuthContextType {
//   user: Admin | null;
//   setUser: (user: Admin | null) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const STORAGE_KEY = 'auth_user';

// const getStoredUser = (): Admin | null => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (!stored) return null;
//     const parsed = JSON.parse(stored);
//     // Validate user object
//     if (parsed && typeof parsed === 'object' && parsed.displayName && parsed.email) {
//       return parsed;
//     }
//     return null;
//   } catch (error) {
//     console.error('Error reading from localStorage:', error);
//     return null;
//   }
// };

// const setStoredUser = (user: Admin | null): void => {
//   try {
//     if (user) {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
//     } else {
//       localStorage.removeItem(STORAGE_KEY);
//     }
//   } catch (error) {
//     console.error('Error writing to localStorage:', error);
//   }
// };

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUserState] = useState<Admin | null>(() => getStoredUser());

//   useEffect(() => {
//     const storedUser = getStoredUser();
//     if (storedUser) {
//       setUserState(storedUser);
//     }
//   }, []);

//   const setUser = (user: Admin | null) => {
//     setUserState(user);
//     setStoredUser(user);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

import { createContext, useContext, useState, useEffect } from 'react';

interface Admin {
  displayName: string;
  email: string;
  phone?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: Admin | null;
  setUser: (user: Admin | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auth_user';

const getStoredUser = (): Admin | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('getStoredUser: stored value from localStorage:', stored); // Debug log
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object' && parsed.displayName && parsed.email) {
      console.log('getStoredUser: parsed user:', parsed); // Debug log
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const setStoredUser = (user: Admin | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      console.log('setStoredUser: stored user in localStorage:', user); // Debug log
    } else {
      localStorage.removeItem(STORAGE_KEY);
      console.log('setStoredUser: removed user from localStorage'); // Debug log
    }
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<Admin | null>(() => getStoredUser());

  useEffect(() => {
    const storedUser = getStoredUser();
    console.log('AuthProvider useEffect: storedUser on mount:', storedUser); // Debug log
    if (storedUser) {
      setUserState(storedUser);
    }
  }, []);

  const setUser = (user: Admin | null) => {
    console.log('setUser: setting user to:', user); // Debug log
    setUserState(user);
    setStoredUser(user);
  };

  console.log('AuthProvider: current user state:', user); // Debug log
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}