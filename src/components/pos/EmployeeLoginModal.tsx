import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Employee } from '@/types/pos';
import { Lock, User } from 'lucide-react';

interface EmployeeLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EmployeeLoginModal({ isOpen, onClose }: EmployeeLoginModalProps) {
    const { employees, isLoading } = useEmployees();
    const { loginAsEmployee } = useAuth();
    const { t } = useLanguage();
    const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
    const [pin, setPin] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const activeEmployees = employees.filter(e => e.active);
    const selectedEmp = activeEmployees.find(e => e.id === selectedEmpId);

    const handleLogin = async () => {
        if (!selectedEmp) return;

        setIsVerifying(true);
        try {
            const { data: isValid, error } = await supabase.rpc('verify_employee_pin', {
                p_employee_id: selectedEmp.id,
                p_pin: pin,
            });

            if (error) throw error;

            if (isValid) {
                loginAsEmployee(selectedEmp);
                toast.success(`${t('pos.employeeLoggedIn')} ${selectedEmp.name}`);
                setPin('');
                setSelectedEmpId(null);
                onClose();
            } else {
                toast.error(t('pos.pinIncorrect'));
                setPin('');
            }
        } catch (err) {
            toast.error(t('pos.pinVerifyError'));
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('pos.employeeAccess')}</DialogTitle>
                    <DialogDescription>
                        {t('pos.employeeAccessDesc')}
                    </DialogDescription>
                </DialogHeader>

                {!selectedEmpId ? (
                    <div className="grid grid-cols-2 gap-4 py-4">
                        {isLoading ? (
                            <div className="col-span-2 text-center text-muted-foreground">{t('common.loading')}</div>
                        ) : (
                            activeEmployees.map((emp: Employee) => (
                                <Button
                                    key={emp.id}
                                    variant="outline"
                                    className="flex flex-col items-center justify-center h-24 space-y-2"
                                    onClick={() => setSelectedEmpId(emp.id)}
                                >
                                    <User className="h-6 w-6" />
                                    <span>{emp.name}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{emp.role}</span>
                                </Button>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-primary" />
                                <span className="font-medium">{selectedEmp?.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedEmpId(null); setPin(''); }}>
                                {t('pos.changeEmployee')}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center">
                                <Lock className="w-4 h-4 mr-2" /> {t('pos.enterPin')}
                            </label>
                            <Input
                                type="password"
                                maxLength={4}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                onKeyDown={(e) => { if (e.key === 'Enter' && pin.length >= 4) handleLogin(); }}
                                placeholder="****"
                                className="text-center text-2xl tracking-widest"
                                autoFocus
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleLogin}
                            disabled={pin.length < 4 || isVerifying}
                        >
                            {isVerifying ? t('pos.verifying') : t('pos.enter')}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
