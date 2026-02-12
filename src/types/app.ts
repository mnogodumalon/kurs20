// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Instructors {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    specialty?: string;
  };
}

export interface Participants {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    birth_date?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface Rooms {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    building?: string;
    capacity?: number;
  };
}

export interface Courses {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    title?: string;
    description?: string;
    start_date?: string; // Format: YYYY-MM-DD oder ISO String
    end_date?: string; // Format: YYYY-MM-DD oder ISO String
    max_participants?: number;
    price?: number;
    instructor?: string; // applookup -> URL zu 'Instructors' Record
    room?: string; // applookup -> URL zu 'Rooms' Record
  };
}

export interface Registrations {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    participant?: string; // applookup -> URL zu 'Participants' Record
    course?: string; // applookup -> URL zu 'Courses' Record
    registration_date?: string; // Format: YYYY-MM-DD oder ISO String
    paid?: boolean;
  };
}

export const APP_IDS = {
  INSTRUCTORS: '698dc41e6f9a9520c4296ee9',
  PARTICIPANTS: '698dc41f196c22d9da1f0edd',
  ROOMS: '698dc41f68b94742af639f07',
  COURSES: '698dc41fb5663d0e68bc070c',
  REGISTRATIONS: '698dc42024624596759dd74c',
} as const;

// Helper Types for creating new records
export type CreateInstructors = Instructors['fields'];
export type CreateParticipants = Participants['fields'];
export type CreateRooms = Rooms['fields'];
export type CreateCourses = Courses['fields'];
export type CreateRegistrations = Registrations['fields'];