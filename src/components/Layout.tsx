import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChefHat, 
  QrCode, 
  BarChart3, 
  Settings,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  // Navigation for non-authenticated users
  const publicNavigation = [
    { name: 'Accueil', href: '/', icon: ChefHat },
    { name: 'QR Scanner', href: '/qr', icon: QrCode },
  ];

  // Navigation for authenticated users
  const authenticatedNavigation = [
    { name: 'Accueil', href: '/', icon: ChefHat },
    { name: 'QR Scanner', href: '/qr', icon: QrCode },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Campagnes', href: '/campaigns', icon: MessageSquare },
  ];

  // Choose navigation based on auth status
  const navigation = user ? authenticatedNavigation : publicNavigation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-light/20 to-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">RestauBoost</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Olá, {user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={signOut}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="bg-gradient-primary shadow-warm">
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Actions */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2">
                      <p className="text-sm text-muted-foreground">
                        Logado como: {user.email}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" size="sm" className="w-full bg-gradient-primary shadow-warm">
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">RestauBoost</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                Augmentez votre chiffre d'affaires les jours de faible affluence grâce à notre solution de fidélisation et de marketing ciblé.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Fonctionnalités</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Collecte de contacts</li>
                <li>Campagnes automatisées</li>
                <li>Programme de parrainage</li>
                <li>Analytics détaillés</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Contact</li>
                <li>FAQ</li>
                <li>Aide en ligne</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 RestauBoost. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}