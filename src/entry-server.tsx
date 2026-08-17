import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { DataProvider } from './data/DataProvider';
import { AppShell } from './AppShell';
import type { DealRecord, Buyer, BriefingIssue } from './data/types';

export function render(
  pathname: string,
  data?: { records: DealRecord[]; buyers: Buyer[]; briefing?: BriefingIssue }
): string {
  return renderToString(
    <DataProvider
      initialRecords={data?.records}
      initialBuyers={data?.buyers}
      initialBriefing={data?.briefing}
    >
      <StaticRouter location={pathname}>
        <AppShell />
      </StaticRouter>
    </DataProvider>
  );
}
