import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/eventService';
import { CreateEventDto, UpdateEventDto } from '../types/event';
import { AuthenticatedRequest } from '../middlewares/auth';

export class EventController {
  constructor(private readonly eventService: EventService) {}

  createEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Oturum açmanız gerekiyor' });
        return;
      }

      const eventData: CreateEventDto = req.body;
      const newEvent = await this.eventService.createEvent(userId, eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      next(error);
    }
  };

  getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await this.eventService.getEventById(eventId);
      
      if (!event) {
        res.status(404).json({ message: 'Etkinlik bulunamadı' });
        return;
      }

      res.json(event);
    } catch (error) {
      next(error);
    }
  };

  updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Oturum açmanız gerekiyor' });
        return;
      }

      const eventId = parseInt(req.params.id);
      const updateData: UpdateEventDto = req.body;
      
      const updatedEvent = await this.eventService.updateEvent(eventId, userId, updateData);
      res.json(updatedEvent);
    } catch (error) {
      next(error);
    }
  };

  deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Oturum açmanız gerekiyor' });
        return;
      }

      const eventId = parseInt(req.params.id);
      await this.eventService.deleteEvent(eventId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        sport_id: req.query.sport_id ? parseInt(req.query.sport_id as string) : undefined,
        status: req.query.status as string
      };

      const events = await this.eventService.getAllEvents(filters);
      res.json(events);
    } catch (error) {
      next(error);
    }
  };

  getEventsByCreator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Oturum açmanız gerekiyor' });
        return;
      }

      const events = await this.eventService.getEventsByCreator(userId);
      res.json(events);
    } catch (error) {
      next(error);
    }
  };

  approveEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.user?.id;
      if (!adminId) {
        res.status(401).json({ message: 'Oturum açmanız gerekiyor' });
        return;
      }

      // Admin yetkisi kontrolü yapılmalı
      const eventId = parseInt(req.params.id);
      const approvedEvent = await this.eventService.approveEvent(eventId, adminId);
      res.json(approvedEvent);
    } catch (error) {
      next(error);
    }
  };

  rejectEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.user?.id;
      if (!adminId) {
        res.status(401).json({ message: 'Oturum açmanız gerekiyor' });
        return;
      }

      // Admin yetkisi kontrolü yapılmalı
      const eventId = parseInt(req.params.id);
      const reason = req.body.reason;
      const rejectedEvent = await this.eventService.rejectEvent(eventId, adminId, reason);
      res.json(rejectedEvent);
    } catch (error) {
      next(error);
    }
  };
} 