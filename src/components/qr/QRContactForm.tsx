import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { InternationalPhoneInput } from "@/components/ui/international-phone-input";
import { User, Mail, Save, QrCode, Plus, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ContactFormData {
    name: string;
    phone: string;
    email: string;
    notes: string;
    tags: string[];
    country_code: string;
}

interface QRContactFormProps {
    showForm: boolean;
    contactForm: ContactFormData;
    setContactForm: React.Dispatch<React.SetStateAction<ContactFormData>>;
    newTag: string;
    setNewTag: React.Dispatch<React.SetStateAction<string>>;
    isSubmitting: boolean;
    addTag: () => void;
    removeTag: (tag: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export function QRContactForm({
    showForm,
    contactForm,
    setContactForm,
    newTag,
    setNewTag,
    isSubmitting,
    addTag,
    removeTag,
    handleSubmit
}: QRContactFormProps) {
    const { t } = useLanguage();

    return (
        <Card className={showForm ? '' : 'opacity-50'}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t('qrForm.contactData')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {showForm ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('qrForm.nameRequired')}</Label>
                            <Input
                                id="name"
                                value={contactForm.name}
                                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder={t('qrForm.customerName')}
                                required
                            />
                        </div>

                        <InternationalPhoneInput
                            id="phone"
                            value={contactForm.phone}
                            onChange={(value, country) => setContactForm(prev => ({
                                ...prev,
                                phone: value,
                                country_code: country.code
                            }))}
                            label={t('qrForm.phone')}
                            defaultCountry={contactForm.country_code}
                            required
                        />

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('qrForm.email')}</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="email@exemplo.com"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('qrForm.tags')}</Label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder={t('qrForm.addTag')}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" onClick={addTag} size="sm">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {contactForm.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="ml-1 h-auto p-0"
                                            onClick={() => removeTag(tag)}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">{t('qrForm.notes')}</Label>
                            <Textarea
                                id="notes"
                                value={contactForm.notes}
                                onChange={(e) => setContactForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder={t('qrForm.customerNotes')}
                                rows={3}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                t('qrForm.saving')
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {t('qrForm.saveContact')}
                                </>
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>{t('qrForm.scanToFill')}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
