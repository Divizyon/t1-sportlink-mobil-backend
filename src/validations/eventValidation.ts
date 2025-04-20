import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    sport_id: z.number(),
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    event_date: z.string().transform((str) => new Date(str)),
    start_time: z.string().transform((str) => new Date(str)),
    end_time: z.string().transform((str) => new Date(str)),
    location_name: z.string().min(3).max(100),
    location_latitude: z.number().min(-90).max(90),
    location_longitude: z.number().min(-180).max(180),
    max_participants: z.number().min(2).max(1000),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    event_date: z.string().transform((str) => new Date(str)).optional(),
    start_time: z.string().transform((str) => new Date(str)).optional(),
    end_time: z.string().transform((str) => new Date(str)).optional(),
    location_name: z.string().min(3).max(100).optional(),
    location_latitude: z.number().min(-90).max(90).optional(),
    location_longitude: z.number().min(-180).max(180).optional(),
    max_participants: z.number().min(2).max(1000).optional(),
    status: z.enum(['active', 'cancelled']).optional(),
  }),
}); 