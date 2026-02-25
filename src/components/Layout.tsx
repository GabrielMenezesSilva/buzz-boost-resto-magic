import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import dopplerDineLogo from '@/assets/dopplerDine-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  ChefHat,
  QrCode,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  UserCircle,
  Crown,
  HelpCircle,
  Store,
  Tag,
  Package,
  Truck,
  Archive,
  LayoutDashboard,
  Shield,
  Wallet,
  DollarSign,
  TrendingUp,
  PieChart
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, profile, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  // Debug: Check if Layout is rendering multiple times
  console.log('Layout rendering - current path:', location.pathname);

  // Get display name - prefer owner_name, fallback to email
  const getDisplayName = () => {
    if (profile?.owner_name) {
      return profile.owner_name;
    }
    return user?.email || 'Usuário';
  };

  // Prevent seeing layout during onboarding or POS system
  if (location.pathname === '/onboarding' || location.pathname.startsWith('/pos')) {
    return <main>{children}</main>;
  }

  const publicNavigation = [
    { name: t('nav.home'), href: '/', icon: ChefHat },
    { name: t('nav.plans'), href: '/plans', icon: Settings },
    { name: t('nav.support'), href: '/support', icon: HelpCircle },
  ];

  // Navigation for authenticated users
  let authenticatedNavigation: any[] = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    {
      name: t('nav.stockManagement'),
      icon: Package,
      items: [
        { name: t('nav.inventory'), href: '/inventory', icon: Archive },
        { name: t('nav.products'), href: '/products', icon: Package },
        { name: t('nav.categories'), href: '/categories', icon: Tag },
        { name: t('nav.suppliers'), href: '/suppliers', icon: Truck },
      ]
    },
    {
      name: t('nav.marketingCrm'),
      icon: MessageSquare,
      items: [
        { name: t('nav.contacts'), href: '/contacts', icon: Users },
        { name: t('nav.campaigns'), href: '/campaigns', icon: MessageSquare },
        { name: t('nav.generateQr'), href: '/qr', icon: QrCode },
      ]
    },
    {
      name: t('nav.posGroup'),
      icon: Store,
      items: [
        { name: t('nav.terminalPos'), href: '/pos', icon: LayoutDashboard },
        { name: t('nav.orderHistory'), href: '/orders', icon: Archive },
        { name: t('nav.tables'), href: '/tables', icon: Store },
        { name: t('nav.employees'), href: '/employees', icon: Users },
      ]
    },
    {
      name: t('nav.financeGroup') || 'Financeiro',
      icon: Wallet,
      items: [
        { name: t('nav.cashflow'), href: '/cashflow', icon: DollarSign },
        { name: t('nav.reports'), href: '/reports', icon: TrendingUp },
      ]
    }
  ];

  // Choose navigation based on auth status
  const navigation = user ? authenticatedNavigation : publicNavigation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-light/20 to-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <Link to="/" className="flex flex-shrink-0 items-center space-x-2 xl:space-x-3 mr-2 xl:mr-4">
              <img src={dopplerDineLogo} alt="DopplerDine" className="w-8 h-8 xl:w-10 xl:h-10" />
              <span className="text-lg xl:text-xl font-bold text-foreground hidden sm:block">DopplerDine</span>
            </Link>

            <nav className="hidden xl:flex items-center space-x-0.5 lg:space-x-1.5 flex-1 justify-center px-0 min-w-0">
              {navigation.map((item) => {
                const Icon = item.icon;

                if (item.items) {
                  const isAnyActive = item.items.some((subItem: any) => isActive(subItem.href));

                  return (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`flex items-center space-x-1.5 px-2 py-2 rounded-md text-[13px] 2xl:text-sm font-medium transition-all duration-200 ${isAnyActive
                            ? 'text-primary bg-primary/10 shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="whitespace-nowrap">{item.name}</span>
                          <ChevronDown className="w-3 h-3 ml-1 opacity-50 flex-shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48 z-50">
                        {item.items.map((subItem: any) => {
                          const SubIcon = subItem.icon;
                          const subActive = isActive(subItem.href);
                          return (
                            <DropdownMenuItem key={subItem.href} asChild>
                              <Link
                                to={subItem.href}
                                className={`flex items-center space-x-2 cursor-pointer w-full ${subActive ? 'text-primary font-medium bg-primary/5' : ''
                                  }`}
                              >
                                <SubIcon className="w-4 h-4" />
                                <span>{subItem.name}</span>
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <Link
                    key={item.name || item.href}
                    to={item.href}
                    className={`flex items-center space-x-1.5 px-2 py-2 rounded-md text-[13px] 2xl:text-sm font-medium transition-all duration-200 ${isActive(item.href)
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="xl:hidden">
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

            <div className="hidden xl:flex flex-shrink-0 items-center space-x-2 pl-2 border-l border-border/50 ml-0 lg:ml-2">
              <LanguageSelector />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                    >
                      <User className="w-4 h-4" />
                      <span className="truncate max-w-[100px] xl:max-w-[150px]">
                        {t('auth.hello')}, {getDisplayName()}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-50" sideOffset={5}>
                    {/* User Information Section */}
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <UserCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{getDisplayName()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {profile?.restaurant_name || user?.email}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Admin Section */}
                    {profile?.role === 'super_admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center space-x-2 cursor-pointer text-primary">
                          <Shield className="w-4 h-4" />
                          <span>{t('nav.adminPanel')}</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {/* Settings Section */}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
                        <UserCircle className="w-4 h-4" />
                        <span>{t('nav.profile')}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center space-x-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        <span>{t('nav.settings')}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/plans" className="flex items-center space-x-2 cursor-pointer">
                        <Crown className="w-4 h-4" />
                        <span>{t('nav.currentPlan')}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Actions Section */}
                    <DropdownMenuItem asChild>
                      <Link to="/support" className="flex items-center space-x-2 cursor-pointer">
                        <HelpCircle className="w-4 h-4" />
                        <span>{t('nav.helpSupport')}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={signOut}
                      className="flex items-center space-x-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="bg-gradient-primary shadow-warm">
                    {t('nav.login')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                if (item.items) {
                  return (
                    <div key={item.name} className="space-y-1 py-1">
                      <div className="flex items-center px-3 py-2 text-sm font-medium text-foreground">
                        <Icon className="w-5 h-5 mr-3 text-muted-foreground" />
                        <span>{item.name}</span>
                      </div>
                      <div className="pl-11 space-y-1">
                        {item.items.map((subItem: any) => {
                          const SubIcon = subItem.icon;
                          const subActive = isActive(subItem.href);
                          return (
                            <Link
                              key={subItem.name || subItem.href}
                              to={subItem.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${subActive
                                ? 'text-primary bg-primary/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name || item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
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
                <div className="flex justify-between items-center mb-3">
                  <LanguageSelector />
                </div>
                {user ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2 border-b border-border/50 pb-3 mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.restaurant_name || user?.email}
                      </p>
                    </div>

                    {profile?.role === 'super_admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start space-x-2 text-primary">
                          <Shield className="w-4 h-4" />
                          <span>{t('nav.adminPanel')}</span>
                        </Button>
                      </Link>
                    )}

                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start space-x-2">
                        <UserCircle className="w-4 h-4" />
                        <span>{t('nav.profile')}</span>
                      </Button>
                    </Link>

                    <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>{t('nav.settings')}</span>
                      </Button>
                    </Link>

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
                      <span>{t('nav.logout')}</span>
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" size="sm" className="w-full bg-gradient-primary shadow-warm">
                      {t('nav.login')}
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
                <img src={dopplerDineLogo} alt="DopplerDine" className="w-8 h-8" />
                <span className="text-lg font-bold">DopplerDine</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.features')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('footer.contactCollection')}</li>
                <li>{t('footer.automatedCampaigns')}</li>
                <li>{t('footer.referralProgram')}</li>
                <li>{t('footer.detailedAnalytics')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/support" className="hover:text-primary transition-colors">{t('footer.contact') || 'Contato'}</Link></li>
                <li><Link to="/support" className="hover:text-primary transition-colors">{t('footer.faq') || 'Perguntas Frequentes'}</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy') || 'Política de Privacidade'}</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">{t('footer.terms') || 'Termos de Uso'}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 DopplerDine. {t('footer.allRights')}
          </div>
        </div>
      </footer>
    </div>
  );
}