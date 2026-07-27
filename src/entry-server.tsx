import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { DataProvider } from './data/DataProvider';
import { AppShell } from './AppShell';
import type { DealRecord, Buyer } from './data/types';

export function render(
  pathname: string,
  data?: { records: DealRecord[]; buyers: Buyer[] }
): string {
  return renderToString(
    <DataProvider initialRecords={data?.records} initialBuyers={data?.buyers}>
      <StaticRouter location={pathname}>
        <AppShell />
      </StaticRouter>
    </DataProvider>
  );
}
