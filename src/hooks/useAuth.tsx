import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { tokenStorage, getTokenPayload } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  profile?: UserProfile;
}

interface UserProfile {
  id: string;
  owner_name: string | null;
  restaurant_name: string | null;
  phone: string | null;
  qr_code: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, restaurantName: string, ownerName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch current user and profile
  const fetchCurrentUser = async () => {
    try {
      const token = tokenStorage.get();
      if (!token) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const userData = await apiService.getCurrentUser();
      setUser(userData.user);
      setProfile(userData.user.profile || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching current user:', error);
      tokenStorage.remove();
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing token and fetch user
    fetchCurrentUser();
  }, []);

  const signUp = async (email: string, password: string, restaurantName: string, ownerName: string) => {
    try {
      const response = await apiService.register(email, password, restaurantName, ownerName);
      
      if (response.token) {
        tokenStorage.set(response.token);
        setUser(response.user);
        setProfile(response.user.profile || null);
      }

      toast({
        title: "Cadastro realizado!",
        description: "Conta criada com sucesso."
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Erro no cadastro";
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: { message: errorMessage } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.token) {
        tokenStorage.set(response.token);
        setUser(response.user);
        setProfile(response.user.profile || null);
      }

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Erro no login";
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    tokenStorage.remove();
    setUser(null);
    setProfile(null);
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};