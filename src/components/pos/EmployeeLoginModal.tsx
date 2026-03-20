import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/hooks/useAuth';
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
    const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
    const [pin, setPin] = useState('');

    const activeEmployees = employees.filter(e => e.active);
    const selectedEmp = activeEmployees.find(e => e.id === selectedEmpId);

    const handleLogin = () => {
        if (!selectedEmp) return;

        // In a real app we should verify the PIN securely on the backend, 
        // but for now we verify it against the local state since we fetched the employees.
        if (selectedEmp.pin === pin) {
            loginAsEmployee(selectedEmp);
            toast.success(`Logado como ${selectedEmp.name}`);
            setPin('');
            setSelectedEmpId(null);
            onClose();
        } else {
            toast.error('PIN incorreto');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Acesso de Colaborador</DialogTitle>
                    <DialogDescription>
                        Selecione seu perfil e digite seu PIN para acessar o sistema.
                    </DialogDescription>
                </DialogHeader>

                {!selectedEmpId ? (
                    <div className="grid grid-cols-2 gap-4 py-4">
                        {isLoading ? (
                            <div className="col-span-2 text-center text-muted-foreground">Carregando...</div>
                        ) : (
                            activeEmployees.map(emp => (
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
                                Trocar
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center">
                                <Lock className="w-4 h-4 mr-2" /> Digite seu PIN
                            </label>
                            <Input
                                type="password"
                                maxLength={4}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="****"
                                className="text-center text-2xl tracking-widest"
                                autoFocus
                            />
                        </div>

                        <Button className="w-full" onClick={handleLogin} disabled={pin.length < 4}>
                            Entrar
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
