import { SupabaseClient } from '@supabase/supabase-js';
import { Event, CreateEventDto, UpdateEventDto, EventFilters } from '../types/event';

export class EventService {
  constructor(private readonly supabase: SupabaseClient) {}

  async createEvent(userId: string, eventData: CreateEventDto): Promise<Event> {
    const { data, error } = await this.supabase
      .from('Events')
      .insert({
        ...eventData,
        creator_id: userId,
        status: 'active',
        updated_at: new Date(),
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Etkinlik oluşturulurken hata oluştu: ${error.message}`);
    }

    return data;
  }

  async getEventById(eventId: number): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('Events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      throw new Error(`Etkinlik getirilirken hata oluştu: ${error.message}`);
    }

    return data;
  }

  async updateEvent(eventId: number, userId: number, updateData: UpdateEventDto): Promise<Event> {
    // Önce etkinliğin sahibi olduğunu kontrol et
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Etkinlik bulunamadı');
    }
    if (event.creator_id !== userId) {
      throw new Error('Bu etkinliği güncelleme yetkiniz yok');
    }

    const { data, error } = await this.supabase
      .from('Events')
      .update({
        ...updateData,
        updated_at: new Date(),
      })
      .eq('id', eventId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Etkinlik güncellenirken hata oluştu: ${error.message}`);
    }

    return data;
  }

  async deleteEvent(eventId: number, userId: number): Promise<void> {
    // Önce etkinliğin sahibi olduğunu kontrol et
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Etkinlik bulunamadı');
    }
    if (event.creator_id !== userId) {
      throw new Error('Bu etkinliği silme yetkiniz yok');
    }

    const { error } = await this.supabase
      .from('Events')
      .delete()
      .eq('id', eventId);

    if (error) {
      throw new Error(`Etkinlik silinirken hata oluştu: ${error.message}`);
    }
  }

  async getAllEvents(filters?: EventFilters): Promise<Event[]> {
    let query = this.supabase.from('Events').select('*');

    if (filters) {
      if (filters.sport_id) {
        query = query.eq('sport_id', filters.sport_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.approval_status) {
        query = query.eq('approval_status', filters.approval_status);
      }
      if (filters.start_date) {
        query = query.gte('event_date', filters.start_date.toISOString());
      }
      if (filters.end_date) {
        query = query.lte('event_date', filters.end_date.toISOString());
      }
      
      // Konum bazlı filtreleme için stored procedure kullanımı
      if (filters.location_latitude && filters.location_longitude && filters.radius) {
        const { data: nearbyEvents, error } = await this.supabase
          .rpc('events_within_radius', {
            lat: filters.location_latitude,
            lng: filters.location_longitude,
            radius_km: filters.radius
          });
          
        if (error) {
          throw new Error(`Konum bazlı filtreleme hatası: ${error.message}`);
        }
        
        return nearbyEvents || [];
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Etkinlikler getirilirken hata oluştu: ${error.message}`);
    }

    return data || [];
  }

  async getEventsByCreator(userId: number): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('Events')
      .select('*')
      .eq('creator_id', userId);

    if (error) {
      throw new Error(`Kullanıcının etkinlikleri getirilirken hata oluştu: ${error.message}`);
    }

    return data || [];
  }

  async approveEvent(eventId: number, _adminId: number): Promise<Event> {
    // Admin yetkisi kontrolü yapılmalı
    const { data, error } = await this.supabase
      .from('Events')
      .update({
        approval_status: 'approved',
        updated_at: new Date(),
      })
      .eq('id', eventId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Etkinlik onaylanırken hata oluştu: ${error.message}`);
    }

    return data;
  }

  async rejectEvent(eventId: number, _adminId: number, reason: string = 'Belirtilmemiş'): Promise<Event> {
    // Admin yetkisi kontrolü yapılmalı
    const { data, error } = await this.supabase
      .from('Events')
      .update({
        approval_status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date(),
      })
      .eq('id', eventId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Etkinlik reddedilirken hata oluştu: ${error.message}`);
    }

    return data;
  }
} 