import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useContacts } from "@/hooks/useContacts";
import ContactDialog from "@/components/ContactDialog";
import { Link } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Edit,
  Trash2,
  QrCode,
  Download,
  Calendar
} from "lucide-react";

const Contacts = () => {
  const { t } = useLanguage();
  const {
    contacts,
    loading,
    searchTerm,
    setSearchTerm,
    filterSource,
    setFilterSource,
    addContact,
    updateContact,
    deleteContact
  } = useContacts();

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === contacts.length ? [] : contacts.map(c => c.id)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSourceLabel = (source: string) => {
    const sourceKey = source?.toLowerCase();
    switch (sourceKey) {
      case 'qr_scan':
        return t('contacts.filter.qrCode');
      case 'manual':
        return t('contacts.filter.manual');
      case 'import':
        return t('contacts.filter.import');
      default:
        return source;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'qr_scan':
        return <QrCode className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('contacts.title')}</h1>
            <p className="text-muted-foreground">
              {t('contacts.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/qr">
              <Button variant="outline" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                {t('contacts.scanQr')}
              </Button>
            </Link>
            <ContactDialog
              onSave={addContact}
              trigger={
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {t('contacts.newContact')}
                </Button>
              }
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('contacts.stats.total')}</p>
                  <p className="text-2xl font-bold">{contacts.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('contacts.stats.viaQr')}</p>
                  <p className="text-2xl font-bold">
                    {contacts.filter(c => c.source === 'qr_scan').length}
                  </p>
                </div>
                <QrCode className="w-8 h-8 text-secondary opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('contacts.stats.withEmail')}</p>
                  <p className="text-2xl font-bold">
                    {contacts.filter(c => c.email).length}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-accent opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('contacts.stats.thisWeek')}</p>
                  <p className="text-2xl font-bold">
                    {contacts.filter(c => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(c.created_at) > weekAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('contacts.search.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('contacts.filter.allSources')}</SelectItem>
                    <SelectItem value="qr_scan">{t('contacts.filter.qrCode')}</SelectItem>
                    <SelectItem value="manual">{t('contacts.filter.manual')}</SelectItem>
                    <SelectItem value="import">{t('contacts.filter.import')}</SelectItem>
                  </SelectContent>
                </Select>

                {selectedContacts.length > 0 && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      {t('contacts.export')} ({selectedContacts.length})
                    </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {contacts.length > 0 ? `${contacts.length} ${t('contacts.contactsCount')}` : t('contacts.noContactsFound')}
              </CardTitle>
              {contacts.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedContacts.length === contacts.length ? t('contacts.unselectAll') : t('contacts.selectAll')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {contacts.length > 0 ? (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                      selectedContacts.includes(contact.id) ? 'bg-muted border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                        className="rounded"
                      />
                      
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg">{contact.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{contact.phone}</span>
                          </div>
                          {contact.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            {getSourceIcon(contact.source)}
                            <span>{getSourceLabel(contact.source)}</span>
                          </div>
                        </div>
                        {contact.tags && contact.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {contact.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{t('contacts.addedOn')}</p>
                        <p>{formatDate(contact.created_at)}</p>
                      </div>
                      
                      <div className="flex space-x-1">
                        <ContactDialog
                          contact={contact}
                          onSave={(data) => updateContact(contact.id, data)}
                          trigger={
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          }
                        />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('contacts.confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('contacts.deleteConfirmMessage')} "{contact.name}"? 
                                {t('contacts.deleteWarning')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('contacts.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteContact(contact.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t('contacts.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">{t('contacts.noContactsFoundMessage')}</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filterSource !== 'all' 
                    ? t('contacts.adjustFilters')
                    : t('contacts.getStarted')
                  }
                </p>
                <div className="flex justify-center gap-3">
                  <Link to="/qr">
                      <Button variant="outline">
                        <QrCode className="w-4 h-4 mr-2" />
                        {t('contacts.scanQrCode')}
                      </Button>
                  </Link>
                  <ContactDialog
                    onSave={addContact}
                    trigger={
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          {t('contacts.addContact')}
                        </Button>
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contacts;