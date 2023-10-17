import { createContext, useContext, useReducer } from 'react';

type User = {
  email: string;
  givenName: string;
  familyName: string;
  userId: string;
  role: string;
  rewards: string;
} | null;

type AuthState = {
  isAuthenticated: boolean;
  user: User;
};

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LOGOUT' }

const AuthContext = createContext<{isAuthenticated: boolean, user: User, dispatch: React.Dispatch<Action>}>({
  isAuthenticated: false,
  user: JSON.parse(localStorage.getItem('user') || '{}') || null,
  dispatch: () => {}
});

export const authReducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('ud');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'UPDATE_USER':
      console.log(action.payload);
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    default:
      throw new Error('Unknown action type');
  }
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: !!localStorage.getItem('ud'),
    user: JSON.parse(localStorage.getItem('user') || '{}') || null,
  });    

  return (
    <AuthContext.Provider value={{...state, dispatch}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthContext);