import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '+33 6 12 34 56 78',
      firstVisit: '2024-01-15',
      lastVisit: '2024-01-20',
      visits: 3,
      rating: 5,
      status: 'active',
      referral: false
    },
    {
      id: 2,
      name: 'Pierre Martin',
      email: 'p.martin@email.com',
      phone: '+33 6 87 65 43 21',
      firstVisit: '2024-01-10',
      lastVisit: '2024-01-18',
      visits: 5,
      rating: 4,
      status: 'active',
      referral: true
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.l@email.com',
      phone: '+33 6 98 76 54 32',
      firstVisit: '2024-01-12',
      lastVisit: '2024-01-12',
      visits: 1,
      rating: 5,
      status: 'new',
      referral: false
    },
    {
      id: 4,
      name: 'Jean Moreau',
      email: 'j.moreau@email.com',
      phone: '+33 6 11 22 33 44',
      firstVisit: '2023-12-20',
      lastVisit: '2024-01-05',
      visits: 8,
      rating: 4,
      status: 'inactive',
      referral: true
    }
  ];

  const stats = [
    { title: 'Total contacts', value: contacts.length, icon: Mail },
    { title: 'Nouveaux ce mois', value: 12, icon: Plus },
    { title: 'Clients fidèles', value: 45, icon: Calendar },
    { title: 'Parrainages', value: 8, icon: MapPin },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-2">
            Gérez votre base de contacts clients
          </p>
        </div>
        <Button className="bg-gradient-primary shadow-warm">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des contacts</CardTitle>
          <CardDescription>
            Tous vos contacts collectés via les QR codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Contacts Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Visites</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière visite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          {contact.referral && (
                            <Badge variant="secondary" className="text-xs">
                              Parrain
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {contact.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="w-3 h-3 mr-1" />
                          {contact.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{contact.visits}</TableCell>
                    <TableCell>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < contact.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          contact.status === 'active' ? 'default' : 
                          contact.status === 'new' ? 'secondary' : 'outline'
                        }
                      >
                        {contact.status === 'active' ? 'Actif' : 
                         contact.status === 'new' ? 'Nouveau' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(contact.lastVisit).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}