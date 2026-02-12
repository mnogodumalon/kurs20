import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';
import type { Registrations, Courses, Participants } from '@/types/app';

export function RegistrationsTab() {
  const [registrations, setRegistrations] = useState<Registrations[]>([]);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registrations | null>(null);
  const [formData, setFormData] = useState({
    participant_id: '',
    course_id: '',
    registration_date: new Date().toISOString().split('T')[0],
    paid: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [registrationsData, coursesData, participantsData] = await Promise.all([
        LivingAppsService.getRegistrations(),
        LivingAppsService.getCourses(),
        LivingAppsService.getParticipants()
      ]);
      setRegistrations(registrationsData);
      setCourses(coursesData);
      setParticipants(participantsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      participant_id: '',
      course_id: '',
      registration_date: new Date().toISOString().split('T')[0],
      paid: false
    });
    setEditingRegistration(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (registration: Registrations) => {
    setEditingRegistration(registration);
    setFormData({
      participant_id: extractRecordId(registration.fields.participant) || '',
      course_id: extractRecordId(registration.fields.course) || '',
      registration_date: registration.fields.registration_date || new Date().toISOString().split('T')[0],
      paid: registration.fields.paid || false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const fields = {
        participant: formData.participant_id ? createRecordUrl(APP_IDS.PARTICIPANTS, formData.participant_id) : undefined,
        course: formData.course_id ? createRecordUrl(APP_IDS.COURSES, formData.course_id) : undefined,
        registration_date: formData.registration_date,
        paid: formData.paid
      };

      if (editingRegistration) {
        await LivingAppsService.updateRegistration(editingRegistration.record_id, fields);
      } else {
        await LivingAppsService.createRegistration(fields);
      }
      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving registration:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteRegistration(id);
      setRegistrations(registrations.filter(r => r.record_id !== id));
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  const togglePaid = async (registration: Registrations) => {
    try {
      await LivingAppsService.updateRegistration(registration.record_id, {
        paid: !registration.fields.paid
      });
      await loadData();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy', { locale: de });
    } catch {
      return dateStr;
    }
  };

  const getParticipantName = (participantUrl: string | undefined) => {
    const id = extractRecordId(participantUrl);
    if (!id) return '-';
    const participant = participants.find(p => p.record_id === id);
    return participant?.fields.name || '-';
  };

  const getCourseTitle = (courseUrl: string | undefined) => {
    const id = extractRecordId(courseUrl);
    if (!id) return '-';
    const course = courses.find(c => c.record_id === id);
    return course?.fields.title || '-';
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Anmeldungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Anmeldungen</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Neue Anmeldung
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRegistration ? 'Anmeldung bearbeiten' : 'Neue Anmeldung'}</DialogTitle>
              <DialogDescription>
                {editingRegistration ? 'Bearbeiten Sie die Anmeldung.' : 'Melden Sie einen Teilnehmer für einen Kurs an.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="participant">Teilnehmer</Label>
                <Select
                  value={formData.participant_id}
                  onValueChange={(value) => setFormData({ ...formData, participant_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Teilnehmer auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants.map((participant) => (
                      <SelectItem key={participant.record_id} value={participant.record_id}>
                        {participant.fields.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course">Kurs</Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kurs auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.record_id} value={course.record_id}>
                        {course.fields.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="registration_date">Anmeldedatum</Label>
                <Input
                  id="registration_date"
                  type="date"
                  value={formData.registration_date}
                  onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paid">Bezahlt</Label>
                <Select
                  value={formData.paid ? 'yes' : 'no'}
                  onValueChange={(value) => setFormData({ ...formData, paid: value === 'yes' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Ja</SelectItem>
                    <SelectItem value="no">Nein</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSubmit}>
                {editingRegistration ? 'Speichern' : 'Erstellen'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Teilnehmer</TableHead>
                <TableHead>Kurs</TableHead>
                <TableHead>Anmeldedatum</TableHead>
                <TableHead className="text-center">Bezahlt</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.record_id} className="transition-card hover:bg-accent/50">
                  <TableCell className="font-medium">{getParticipantName(registration.fields.participant)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCourseTitle(registration.fields.course)}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(registration.fields.registration_date)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => togglePaid(registration)}
                    >
                      {registration.fields.paid ? (
                        <Badge variant="success" className="gap-1">
                          <Check className="h-3 w-3" />
                          Bezahlt
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="gap-1">
                          <X className="h-3 w-3" />
                          Offen
                        </Badge>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(registration)}
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
                            <AlertDialogTitle>Anmeldung löschen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Möchten Sie diese Anmeldung wirklich löschen?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(registration.record_id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {registrations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Keine Anmeldungen vorhanden. Erstellen Sie Ihre erste Anmeldung.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
