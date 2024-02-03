import { Mongoose } from 'mongoose';
import { TicketSchema } from './schema/ticket.schema';

export const ticketProviders = [
  {
    provide: 'TICKET_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Tickets', TicketSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
