import React, { createContext, useContext, useState, ReactNode } from 'react';
interface User {
  id: number;
  nome: string;
  password: string;
  ocupado: boolean;
  of: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado dentro de um UserProvider');
  return context;
};

export const users = [
  { id: 1, nome: 'Felipe De Paula', password: '1234', ocupado: false, of: '' },
  { id: 2, nome: 'João', password: '1234', ocupado: false, of: '' },
];