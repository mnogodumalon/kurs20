import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Mail, Phone, BookOpen } from 'lucide-react';
import { LivingAppsService } from '@/services/livingAppsService';
import type { Instructors } from '@/types/app';

export function InstructorsTab() {
  const [instructors, setInstructors] = useState<Instructors[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructors | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await LivingAppsService.getInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Error loading instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', specialty: '' });
    setEditingInstructor(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (instructor: Instructors) => {
    setEditingInstructor(instructor);
    setFormData({
      name: instructor.fields.name || '',
      email: instructor.fields.email || '',
      phone: instructor.fields.phone || '',
      specialty: instructor.fields.specialty || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const fields = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty
      };

      if (editingInstructor) {
        await LivingAppsService.updateInstructor(editingInstructor.record_id, fields);
      } else {
        await LivingAppsService.createInstructor(fields);
      }
      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving instructor:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteInstructor(id);
      setInstructors(instructors.filter(i => i.record_id !== id));
    } catch (error) {
      console.error('Error deleting instructor:', error);
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Dozenten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Dozenten</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Neuer Dozent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingInstructor ? 'Dozent bearbeiten' : 'Neuer Dozent'}</DialogTitle>
              <DialogDescription>
                {editingInstructor ? 'Bearbeiten Sie die Dozentendaten.' : 'Fügen Sie einen neuen Dozenten hinzu.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Vollständiger Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+49 151 12345678"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialty">Fachgebiet</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="z.B. Webentwicklung"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSubmit}>
                {editingInstructor ? 'Speichern' : 'Erstellen'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map((instructor) => (
            <Card key={instructor.record_id} className="shadow-card transition-card hover:shadow-card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
                      {getInitials(instructor.fields.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{instructor.fields.name}</h3>
                      {instructor.fields.specialty && (
                        <Badge variant="outline" className="mt-1">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {instructor.fields.specialty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditDialog(instructor)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Dozent löschen?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Möchten Sie den Dozenten "{instructor.fields.name}" wirklich löschen?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(instructor.record_id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {instructor.fields.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{instructor.fields.email}</span>
                    </div>
                  )}
                  {instructor.fields.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{instructor.fields.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {instructors.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Keine Dozenten vorhanden. Fügen Sie Ihren ersten Dozenten hinzu.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
