import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  ANNOUNCEMENTS_SERVICE,
  ACCESS_SERVICE,
  ALL_ORGS,
  Permission,
  AnnouncementDto,
} from '@faithtech-community/api';
import {
  ButtonComponent,
  CardComponent,
  EmptyStateComponent,
  IconComponent,
  IconTileComponent,
  ListComponent,
  ListItemComponent,
  ListSkeletonComponent,
  PageHeaderComponent,
  formatDay,
  OrgLabelComponent,
} from '@faithtech-community/components';
import { firstValueFrom } from 'rxjs';

type State = 'loading' | 'loaded' | 'error';

/**
 * The announcements sent to the member, newest first (L2-030, mock `pages/announcements`). Communications
 * Leads and System Admins also see what they sent, and New announcement (ADR 0016).
 */
@Component({
  selector: 'ft-announcements-page',
  imports: [
    OrgLabelComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    IconComponent,
    IconTileComponent,
    ListComponent,
    ListItemComponent,
    ListSkeletonComponent,
    PageHeaderComponent,
  ],
  templateUrl: './announcements.page.html',
  styleUrl: './announcements.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementsPage {
  private readonly service = inject(ANNOUNCEMENTS_SERVICE);
  private readonly access = inject(ACCESS_SERVICE);

  protected readonly state = signal<State>('loading');
  protected readonly items = signal<AnnouncementDto[]>([]);
  protected readonly hasMore = signal(false);
  protected readonly loadingMore = signal(false);
  protected readonly canSend = computed(() => this.access.can(Permission.AnnouncementsSend));
  /** Rows are labelled with their org under "All orgs" (L2-151 AC4). */
  protected readonly allOrgs = computed(() => this.access.activeSlug() === ALL_ORGS);
  private page = 1;

  constructor() {
    void this.load();
  }

  protected meta(a: AnnouncementDto): string {
    const recipients = `${a.recipientCount} ${a.recipientCount === 1 ? 'recipient' : 'recipients'}`;
    return `To ${audience(a)} · Sent ${formatDay(a.sentAt)} by ${a.senderName} · ${recipients}`;
  }

  protected retry(): void {
    void this.load();
  }

  protected async showOlder(): Promise<void> {
    this.loadingMore.set(true);
    try {
      const next = await firstValueFrom(this.service.list(this.page + 1));
      this.page = next.page;
      this.items.update((items) => [...items, ...next.items]);
      this.hasMore.set(next.page * next.pageSize < next.totalCount);
    } finally {
      this.loadingMore.set(false);
    }
  }

  private async load(): Promise<void> {
    this.state.set('loading');
    try {
      const first = await firstValueFrom(this.service.list(1));
      this.page = 1;
      this.items.set(first.items);
      this.hasMore.set(first.page * first.pageSize < first.totalCount);
      this.state.set('loaded');
    } catch {
      this.state.set('error');
    }
  }
}

/** "Everyone", "Product Engineers, Volunteers" or "RSVPs: Toronto Builders Night". */
function audience(a: AnnouncementDto): string {
  if (a.audienceKind === 'EventRsvps') return `RSVPs: ${a.eventTitle ?? 'an event'}`;
  if (a.audienceKind === 'Portfolio') return 'Everyone in the portfolio';
  if (a.audienceKind === 'Roles') {
    return a.roles.map((r) => (r === 'Staff' ? r : `${r}s`)).join(', ');
  }
  return 'Everyone';
}
