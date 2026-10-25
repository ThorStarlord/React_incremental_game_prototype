import fs from 'fs';
import path from 'path';

const read = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), file), 'utf8');

test('routed content has one page authority and one semantic main landmark', () => {
  const router = read('src/routes/AppRouter.tsx');
  const content = read('src/layout/components/MainContentArea.tsx');
  const layout = read('src/layout/components/GameLayout.tsx');
  expect(router).toContain('<Route path="dashboard" element={<DashboardPage />} />');
  expect(layout).toContain('<Outlet />');
  expect(content).toContain('component="main"');
  expect(content).not.toContain('contentConfig');
  expect(content).not.toContain('renderContent');
  expect(content).not.toContain('useOutlet');
  expect(layout).not.toContain('changeTab={setActiveTab}');
});

test('sidebar actions do not navigate twice and route state is derived from the URL', () => {
  const nav = read('src/layout/components/VerticalNavBar/VerticalNavBar.tsx');
  const state = read('src/layout/hooks/useLayoutState.ts');
  expect(nav).toContain('if (onTabChange)');
  expect(nav).toContain('} else {\n      navigate(');
  expect(state).toContain('getTabFromRoute(location.pathname, config.defaultTab)');
  expect(state).toContain('location.pathname !== targetRoute');
  expect(state).not.toContain("location.pathname.split('/')[2] !== tabId");
  expect(state).toContain('if (!config.syncWithRouter)');
  expect(state).not.toContain('tabFromRoute !== activeTab');
});

test('Copy interruptions remain visible while advanced Trait controls are disclosed on demand', () => {
  const detail = read('src/features/Copy/components/ui/CopyDetailPanel.tsx');
  expect(detail).toContain('data-testid="copy-judgment-summary"');
  expect(detail).toContain('component="details" data-testid="copy-advanced-sharing"');
  expect(detail).toContain('Advanced · Trait sharing and inherited effects');
  expect(detail).toContain('Start Preferred');
  expect(detail).toContain('Standing Order');
  expect(detail.indexOf('data-testid="copy-judgment-summary"'))
    .toBeLessThan(detail.indexOf('Production Delegation'));
});
