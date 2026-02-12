import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GraduationCap,
  Users,
  UserCheck,
  DoorOpen,
  ClipboardList,
  Calendar,
  Euro
} from 'lucide-react';
import { CoursesTab } from '@/components/course-management/CoursesTab';
import { InstructorsTab } from '@/components/course-management/InstructorsTab';
import { ParticipantsTab } from '@/components/course-management/ParticipantsTab';
import { RoomsTab } from '@/components/course-management/RoomsTab';
import { RegistrationsTab } from '@/components/course-management/RegistrationsTab';
import { LivingAppsService } from '@/services/livingAppsService';

interface Stats {
  activeCourses: number;
  totalParticipants: number;
  instructors: number;
  revenue: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [stats, setStats] = useState<Stats>({
    activeCourses: 0,
    totalParticipants: 0,
    instructors: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [courses, participants, instructors, registrations] = await Promise.all([
        LivingAppsService.getCourses(),
        LivingAppsService.getParticipants(),
        LivingAppsService.getInstructors(),
        LivingAppsService.getRegistrations()
      ]);

      // Calculate revenue from paid registrations
      const paidRegistrations = registrations.filter(r => r.fields.paid);
      let totalRevenue = 0;
      for (const reg of paidRegistrations) {
        const courseId = reg.fields.course?.split('/').pop();
        const course = courses.find(c => c.record_id === courseId);
        if (course?.fields.price) {
          totalRevenue += course.fields.price;
        }
      }

      setStats({
        activeCourses: courses.length,
        totalParticipants: participants.length,
        instructors: instructors.length,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2.5 rounded-xl">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Kursverwaltung</h1>
              <p className="text-sm text-muted-foreground">Verwalten Sie Kurse, Dozenten und Teilnehmer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card transition-card hover:shadow-card-hover">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Aktive Kurse
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stats.activeCourses}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card transition-card hover:shadow-card-hover">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Teilnehmer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stats.totalParticipants}</span>
                  <span className="text-xs text-muted-foreground">gesamt</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card transition-card hover:shadow-card-hover">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Dozenten
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stats.instructors}</span>
                  <span className="text-xs text-muted-foreground">aktiv</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card transition-card hover:shadow-card-hover bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-primary" />
                Umsatz
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stats.revenue.toLocaleString('de-DE')}</span>
                  <span className="text-xs text-muted-foreground">EUR</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="courses"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-card rounded-lg transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Kurse</span>
            </TabsTrigger>
            <TabsTrigger
              value="instructors"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-card rounded-lg transition-all"
            >
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Dozenten</span>
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-card rounded-lg transition-all"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Teilnehmer</span>
            </TabsTrigger>
            <TabsTrigger
              value="rooms"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-card rounded-lg transition-all"
            >
              <DoorOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Räume</span>
            </TabsTrigger>
            <TabsTrigger
              value="registrations"
              className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-card rounded-lg transition-all"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Anmeldungen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CoursesTab />
          </TabsContent>
          <TabsContent value="instructors">
            <InstructorsTab />
          </TabsContent>
          <TabsContent value="participants">
            <ParticipantsTab />
          </TabsContent>
          <TabsContent value="rooms">
            <RoomsTab />
          </TabsContent>
          <TabsContent value="registrations">
            <RegistrationsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
