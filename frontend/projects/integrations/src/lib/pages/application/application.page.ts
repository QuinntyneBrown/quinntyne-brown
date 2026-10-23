import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import {
  CONTACT_REQUEST_CREATED,
  ContactRequestData,
  INTEGRATIONS_SERVICE,
  IntegrationApp,
  IntegrationEvent,
} from '@faithtech-community/api';
import {
  AlertComponent,
  BadgeComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  ButtonComponent,
  CardComponent,
  DescriptionListComponent,
  DescriptionListItemComponent,
  EmptyStateComponent,
  EventEntryComponent,
  IconComponent,
  LinkComponent,
  ListSkeletonComponent,
  PageHeaderComponent,
  SecretFieldComponent,
  StackComponent,
  formatDay,
  formatTimestamp,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

type State = 'loading' | 'loaded' | 'error' | 'not-found';

/** An event as the page shows it: a contact request's fields, or any other type's JSON. */
interface EventView {
  event: IntegrationEvent;
  contact: ContactRequestData | null;
  title: string;
  meta: string;
  preview: string;
  received: string;
  occurred: string;
  json: string | null;
}

/** The ICD's endpoint, shown on the connection card. */
const ENDPOINT = 'POST /api/webhooks/events';

/**
 * One application (docs/mocks/pages/application, L2-166): its connection details and its events,
 * newest first, 25 at a time with Load more. Contact requests expand to their fields; any other
 * event type shows its data as JSON.
 */
@Component({
  selector: 'ft-application-page',
  imports: [
    AlertComponent,
    BadgeComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    ButtonComponent,
    CardComponent,
    DescriptionListComponent,
    DescriptionListItemComponent,
    EmptyStateComponent,
    EventEntryComponent,
    IconComponent,
    LinkComponent,
    ListSkeletonComponent,
    PageHeaderComponent,
    SecretFieldComponent,
    StackComponent,
  ],
  templateUrl: './application.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationPage {
  /** The route's `:id`. */
  readonly id = input.required<string>();

  private readonly integrations = inject(INTEGRATIONS_SERVICE);
  private readonly injector = inject(Injector);
  private readonly entries = viewChildren(EventEntryComponent);

  protected readonly endpoint = ENDPOINT;
  protected readonly state = signal<State>('loading');
  protected readonly app = signal<IntegrationApp | null>(null);
  protected readonly events = signal<EventView[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly loadingMore = signal(false);
  protected readonly moreFailed = signal(false);
  protected readonly listHref = computed(() =>
    this.app() ? `/o/${this.app()!.organization.slug}/applications` : '/',
  );
  protected readonly subtitle = computed(() => {
    const app = this.app();
    if (!app) return null;
    const registered = `Registered ${formatDay(app.createdAt)} by ${app.createdBy.name}`;
    const revoked = app.revokedAt
      ? ` · Revoked ${formatDay(app.revokedAt)}${app.revokedBy ? ` by ${app.revokedBy.name}` : ''}`
      : '';
    return `${app.organization.name} · ${registered}${revoked}`;
  });
  protected readonly countLine = computed(() => {
    const shown = this.events().length;
    const total = this.total();
    return shown >= total
      ? `Showing all ${total} event${total === 1 ? '' : 's'}`
      : `Showing ${shown} of ${total} events`;
  });

  constructor() {
    afterNextRender(() => void this.load(), { injector: this.injector });
  }

  protected async load(): Promise<void> {
    this.state.set('loading');
    try {
      const [app, page] = await Promise.all([
        firstValueFrom(this.integrations.get(this.id())),
        firstValueFrom(this.integrations.events(this.id(), 1)),
      ]);
      this.app.set(app);
      this.events.set(page.items.map(view));
      this.total.set(page.totalCount);
      this.page.set(1);
      this.state.set('loaded');
    } catch (error) {
      this.state.set(
        error instanceof HttpErrorResponse && error.status === 404 ? 'not-found' : 'error',
      );
    }
  }

  /** The next 25; focus moves to the first new entry. */
  protected async loadMore(): Promise<void> {
    if (this.loadingMore()) return;
    this.loadingMore.set(true);
    this.moreFailed.set(false);
    const first = this.events().length;
    try {
      const next = await firstValueFrom(this.integrations.events(this.id(), this.page() + 1));
      this.events.update((list) => [...list, ...next.items.map(view)]);
      this.total.set(next.totalCount);
      this.page.update((p) => p + 1);
      afterNextRender(() => this.entries()[first]?.focus(), { injector: this.injector });
    } catch {
      this.moreFailed.set(true);
    } finally {
      this.loadingMore.set(false);
    }
  }
}

function view(event: IntegrationEvent): EventView {
  const received = formatTimestamp(event.receivedAt);
  const occurred = formatTimestamp(event.occurredAt);
  if (event.eventType === CONTACT_REQUEST_CREATED) {
    const contact = event.data as unknown as ContactRequestData;
    const message = String(contact.message ?? '');
    return {
      event,
      contact,
      title: String(contact.name ?? ''),
      meta: `${contact.email} · ${received}`,
      preview: message.length < 70 ? message : `${message.slice(0, 67).trimEnd()}…`,
      received,
      occurred,
      json: null,
    };
  }
  return {
    event,
    contact: null,
    title: event.eventType,
    meta: received,
    preview: '',
    received,
    occurred,
    json: JSON.stringify(event.data, null, 2),
  };
}
