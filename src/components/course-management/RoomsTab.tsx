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
import { Plus, Pencil, Trash2, Building2, Users } from 'lucide-react';
import { LivingAppsService } from '@/services/livingAppsService';
import type { Rooms } from '@/types/app';

export function RoomsTab() {
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Rooms | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    capacity: 20
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await LivingAppsService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', building: '', capacity: 20 });
    setEditingRoom(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (room: Rooms) => {
    setEditingRoom(room);
    setFormData({
      name: room.fields.name || '',
      building: room.fields.building || '',
      capacity: room.fields.capacity || 20
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const fields = {
        name: formData.name,
        building: formData.building,
        capacity: formData.capacity
      };

      if (editingRoom) {
        await LivingAppsService.updateRoom(editingRoom.record_id, fields);
      } else {
        await LivingAppsService.createRoom(fields);
      }
      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await LivingAppsService.deleteRoom(id);
      setRooms(rooms.filter(r => r.record_id !== id));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Räume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Räume</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Neuer Raum
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Raum bearbeiten' : 'Neuer Raum'}</DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Bearbeiten Sie die Raumdaten.' : 'Fügen Sie einen neuen Raum hinzu.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Raumname</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Raum A1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="building">Gebäude</Label>
                <Input
                  id="building"
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  placeholder="z.B. Hauptgebäude"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Kapazität</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSubmit}>
                {editingRoom ? 'Speichern' : 'Erstellen'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <Card key={room.record_id} className="shadow-card transition-card hover:shadow-card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-accent">
                    <Building2 className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditDialog(room)}
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
                          <AlertDialogTitle>Raum löschen?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Möchten Sie "{room.fields.name}" wirklich löschen?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(room.record_id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground text-lg">{room.fields.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{room.fields.building || '-'}</p>
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {room.fields.capacity || 0} Plätze
                </Badge>
              </CardContent>
            </Card>
          ))}
          {rooms.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Keine Räume vorhanden. Fügen Sie Ihren ersten Raum hinzu.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
