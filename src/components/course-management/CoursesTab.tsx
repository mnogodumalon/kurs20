import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';
import type { Courses, Instructors, Rooms } from '@/types/app';

export function CoursesTab() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [instructors, setInstructors] = useState<Instructors[]>([]);
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Courses | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    max_participants: 20,
    price: 0,
    instructor_id: '',
    room_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, instructorsData, roomsData] = await Promise.all([
        LivingAppsService.getCourses(),
        LivingAppsService.getInstructors(),
        LivingAppsService.getRooms()
      ]);
      setCourses(coursesData);
      setInstructors(instructorsData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      max_participants: 20,
      price: 0,
      instructor_id: '',
      room_id: ''
    });
    setEditingCourse(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Courses) => {
    setEditingCourse(course);
    setFormData({
      title: course.fields.title || '',
      description: course.fields.description || '',
      start_date: course.fields.start_date || '',
      end_date: course.fields.end_date || '',
      max_participants: course.fields.max_participants || 20,
      price: course.fields.price || 0,
      instructor_id: extractRecordId(course.fields.instructor) || '',
      room_id: extractRecordId(course.fields.room) || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const fields = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        max_participants: formData.max_participants,
        price: formData.price,
        instructor: formData.instructor_id ? createRecordUrl(APP_IDS.INSTRUCTORS, formData.instructor_id) : undefined,
        room: formData.room_id ? createRecordUrl(APP_IDS.ROOMS, formData.room_id) : undefined
      };

      if (editingCourse) {
        await LivingAppsService.updateCourse(editingCourse.record_id, fields);
      } else {
        await LivingAppsService.createCourse(fields);
      }
      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteCourse(id);
      setCourses(courses.filter(c => c.record_id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
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

  const getInstructorName = (instructorUrl: string | undefined) => {
    const id = extractRecordId(instructorUrl);
    if (!id) return null;
    const instructor = instructors.find(i => i.record_id === id);
    return instructor?.fields.name;
  };

  const getRoomName = (roomUrl: string | undefined) => {
    const id = extractRecordId(roomUrl);
    if (!id) return null;
    const room = rooms.find(r => r.record_id === id);
    return room?.fields.name;
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Kurse</CardTitle>
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
        <CardTitle className="text-xl font-semibold">Kurse</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Neuer Kurs
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Kurs bearbeiten' : 'Neuer Kurs'}</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Bearbeiten Sie die Kursdaten.' : 'Erstellen Sie einen neuen Kurs.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Kurstitel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kursbeschreibung"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Startdatum</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">Enddatum</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="max_participants">Max. Teilnehmer</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Preis (EUR)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructor">Dozent</Label>
                <Select
                  value={formData.instructor_id}
                  onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Dozent auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.record_id} value={instructor.record_id}>
                        {instructor.fields.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="room">Raum</Label>
                <Select
                  value={formData.room_id}
                  onValueChange={(value) => setFormData({ ...formData, room_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Raum auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.record_id} value={room.record_id}>
                        {room.fields.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSubmit}>
                {editingCourse ? 'Speichern' : 'Erstellen'}
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
                <TableHead>Titel</TableHead>
                <TableHead>Zeitraum</TableHead>
                <TableHead>Dozent</TableHead>
                <TableHead>Raum</TableHead>
                <TableHead className="text-center">
                  <Users className="h-4 w-4 mx-auto" />
                </TableHead>
                <TableHead className="text-right">Preis</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.record_id} className="transition-card hover:bg-accent/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.fields.title}</div>
                      {course.fields.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {course.fields.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(course.fields.start_date)} - {formatDate(course.fields.end_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getInstructorName(course.fields.instructor) && (
                      <Badge variant="outline">{getInstructorName(course.fields.instructor)}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {getRoomName(course.fields.room) && (
                      <Badge variant="secondary">{getRoomName(course.fields.room)}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{course.fields.max_participants || '-'}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {course.fields.price?.toLocaleString('de-DE') || '0'} EUR
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(course)}
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
                            <AlertDialogTitle>Kurs löschen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Möchten Sie den Kurs "{course.fields.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(course.record_id)}
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
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Keine Kurse vorhanden. Erstellen Sie Ihren ersten Kurs.
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
