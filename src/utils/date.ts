/**
 * Dates are shown in `siteConfig.timeZone`, so that they do not depend on the machine
 * that builds the site (a hosting service is usually on UTC).
 */
import { siteConfig } from '../site.config';

const DAY = 86_400_000;

/**
 * "2026-11-15" in a post's front matter is read as midnight UTC. Such a value names a
 * calendar day, so it is kept as that day in every time zone.
 */
const zoneFor = (date: Date) => (date.getTime() % DAY === 0 ? 'UTC' : siteConfig.timeZone);

/** `long`: 2026年11月15日 / November 15, 2026. `numeric`: 2026/11/15 / 11/15/2026. */
export function formatDate(date: Date, style: 'long' | 'numeric' = 'numeric'): string {
  return new Intl.DateTimeFormat(siteConfig.lang, {
    year: 'numeric',
    month: style === 'long' ? 'long' : '2-digit',
    day: style === 'long' ? 'numeric' : '2-digit',
    timeZone: zoneFor(date),
  }).format(date);
}

/** The year it is now in the site's time zone. */
export const currentYear = () =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: siteConfig.timeZone }).format(
    new Date(),
  );
