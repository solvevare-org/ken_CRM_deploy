import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Workspace, AppState } from '../types';

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_SIGNUP_TYPE'; payload: 'individual' | 'organization' }
  | { type: 'SET_PAYMENT_COMPLETED'; payload: boolean }
  | { type: 'SET_VERIFICATION_COMPLETED'; payload: boolean }
  | { type: 'ADD_WORKSPACE'; payload: Workspace }
  | { type: 'SET_CURRENT_WORKSPACE'; payload: Workspace }
  | { type: 'SET_WORKSPACE_NAME'; payload: string }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  currentWorkspace: null,
  workspaces: [
    // Sample workspaces for demonstration
    {
      id: 'demo-1',
      name: 'Real Estate Pro',
      description: 'Main workspace for real estate operations and client management',
      type: 'main',
      createdAt: '2024-01-15T10:30:00Z',
      memberCount: 5,
      activeListings: 24,
      totalDeals: 18,
      monthlyRevenue: 45000
    },
    {
      id: 'demo-2',
      name: 'Investment Properties',
      description: 'Dedicated workspace for investment property analysis and management',
      type: 'main',
      createdAt: '2024-02-20T14:15:00Z',
      memberCount: 3,
      activeListings: 12,
      totalDeals: 8,
      monthlyRevenue: 28000
    }
  ],
  signupType: null,
  paymentCompleted: false,
  verificationCompleted: false,
  leads: [],
  properties: [],
  deals: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SIGNUP_TYPE':
      return { ...state, signupType: action.payload };
    case 'SET_PAYMENT_COMPLETED':
      return { ...state, paymentCompleted: action.payload };
    case 'SET_VERIFICATION_COMPLETED':
      return { ...state, verificationCompleted: action.payload };
    case 'ADD_WORKSPACE':
      return { 
        ...state, 
        workspaces: [...state.workspaces, action.payload],
        currentWorkspace: action.payload
      };
    case 'SET_CURRENT_WORKSPACE':
      return { ...state, currentWorkspace: action.payload };
    case 'SET_WORKSPACE_NAME':
      return { ...state, workspaceName: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}