import { Routes } from '@angular/router';

import {
  EventCheckInPage,
  EventFormPage,
  EventPage,
  EventsPage,
  GuestCancelRsvpPage,
  PublicEventPage,
} from './pages';

export const EVENTS_ROUTES: Routes = [
  { path: '', component: EventsPage, title: 'Events' },
  { path: 'new', component: EventFormPage, title: 'New event' },
  { path: ':id', component: EventPage, title: 'Event' },
  { path: ':id/edit', component: EventFormPage, title: 'Edit event' },
  { path: ':id/check-in', component: EventCheckInPage, title: 'Check-in' },
];

/** The anonymous share page at /o/{slug}/events/{id} (L2-149). */
export const ORG_PUBLIC_EVENT_ROUTES: Routes = [
  { path: ':orgSlug/events/:id', component: PublicEventPage, title: 'Event' },
];

/** Anonymous routes under /public/events (L2-023): the old share address, which redirects to the org address, and the guest cancel link. */
export const PUBLIC_EVENT_ROUTES: Routes = [
  { path: ':id', component: PublicEventPage, title: 'Event' },
  { path: ':id/cancel-rsvp', component: GuestCancelRsvpPage, title: 'Cancel your RSVP' },
];
