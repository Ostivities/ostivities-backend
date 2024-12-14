export enum ACCOUNT_TYPE {
  PERSONAL = 'PERSONAL',
  ORGANISATION = 'ORGANISATION',
}

export enum PAYMENT_METHODS {
  TRANSFER = 'TRANSFER',
  CARD = 'CARD',
  FREE = 'FREE',
}

export enum TICKET_ENTITY {
  SINGLE = 'SINGLE',
  COLLECTIVE = 'COLLECTIVE',
}

export enum TICKET_TYPE {
  FREE = 'FREE',
  PAID = 'PAID',
}

export enum EVENT_TYPE {
  FREE = 'FREE',
  PAID = 'PAID',
}

export enum EVENT_MODES {
  FREE = 'FREE',
  PAID = 'PAID',
}

export enum CHECK_IN_STATUS {
  CHECKED_IN = 'CHECKED_IN',
  NOT_CHECKED_IN = 'NOT_CHECKED_IN',
}

export enum TICKET_STOCK {
  LIMITED = 'LIMITED',
  UN_LIMITED = 'UN_LIMITED',
}

export enum EXHIBITION_SPACE {
  PAID = 'PAID',
  FREE = 'FREE',
}

export enum STAFF_ROLE {
  AGENT = 'AGENT',
  USHER = 'USHER',
  AUDITOR = 'AUDITOR',
  OWNER = 'OWNER',
}

export enum STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

export enum EVENT_TYPES {
  WEDDING = 'Wedding',
  BIRTHDAY = 'Birthday',
  HANGOUT = 'Hangout',
  PAINT_AND_SIP = 'Paint & Sip',
  CONCERT = 'Concert',
  CONFERENCE = 'Conference',
  SEMINAR = 'Seminar',
  TECH_EVENT = 'Tech Event',
  ART_EXHIBITION = 'Art Exhibition',
  CARNIVAL = 'Carnival',
  HOLIDAY_CAMP = 'Holiday Camp',
  OTHERS = 'Others',
}

export enum DISCOUNT_TYPES {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum DISCOUNT_USAGE_LIMIT {
  ONCE = 'ONCE',
  UN_LIMITED = 'UN_LIMITED',
}

export enum APPLICABLE_TICKETS {
  ALL_TICKETS = 'ALL_TICKETS',
  SPECIFIC = 'SPECIFIC_TICKET',
}

export interface IResponse {
  statusCode?: string | any;
  message?: string | any;
  data?: any;
}

export enum EVENT_INFO {
  SINGLE = 'SINGLE',
  RECURRING = 'RECURRING',
}

export enum EVENT_TYPE {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export interface ISocials {
  name: string | any;
  url: string | any;
}

export interface ISupportDocuments {
  fileName?: string;
  fileUrl?: string;
}

export interface ISingleEvents {
  ticketType?: string | any;
  ticketName?: string | any;
  ticketStock?: string | any;
  ticketPrice?: string | any;
  purchaseLimit?: number | any;
  ticketDescription?: string | any;
}

export interface ITicketQuestions {
  question: string;
  is_compulsory: boolean;
}

export interface ICollectiveEvents {
  ticketType: string | any;
  ticketName: string | any;
  ticketStock: string | any;
  groupPrice: string | any;
  groupSize: string | any;
  ticketPrice: string | any;
  ticketDescription: string | any;
}

export const enumValues = [
  'Wedding',
  'Birthday party',
  'Hangout',
  'Paint & Sip',
  'Music Show',
  'Hangouts',
  'Others',
];

export enum EVENT_MODE {
  PRIVATE = 'INACTIVE',
  PUBLIC = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export enum EVENT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
}

export enum TEMPLATE {
  TO_GUEST = '',
}

export interface IBanks {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
