export interface Event {
  id: number;
  creator_id: number;
  sport_id: number;
  title: string;
  description: string;
  event_date: Date;
  start_time: Date;
  end_time: Date;
  location_name: string;
  location_latitude: number;
  location_longitude: number;
  max_participants: number;
  status: string;
  approval_status: string;
  created_at: Date;
  updated_at: Date;
}

export interface EventFilters {
  sport_id?: number;
  status?: string;
  approval_status?: string;
  start_date?: Date;
  end_date?: Date;
  location_latitude?: number;
  location_longitude?: number;
  radius?: number; // km cinsinden
}

export interface CreateEventDto {
  sport_id: number;
  title: string;
  description: string;
  event_date: Date;
  start_time: Date;
  end_time: Date;
  location_name: string;
  location_latitude: number;
  location_longitude: number;
  max_participants: number;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  event_date?: Date;
  start_time?: Date;
  end_time?: Date;
  location_name?: string;
  location_latitude?: number;
  location_longitude?: number;
  max_participants?: number;
  status?: string;
} 