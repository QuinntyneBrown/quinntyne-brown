import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from '@angular/router';

/**
 * Builds pages afresh when the org in the URL changes, so nothing loaded for one org stays on
 * screen in another (ADR 0037). Within an org, routes are reused as Angular's default does.
 */
@Injectable()
export class OrgRouteReuseStrategy extends BaseRouteReuseStrategy {
  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return (
      future.routeConfig === curr.routeConfig && future.params['orgSlug'] === curr.params['orgSlug']
    );
  }
}
