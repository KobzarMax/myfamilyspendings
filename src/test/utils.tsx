import { createRootRoute, createRouter, RouterProvider, createRoute, createMemoryHistory } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export function createTestRouter(component: React.ReactNode) {
  const rootRoute = createRootRoute({
    component: () => component,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Index</div>,
  });

  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/test',
    component: () => <div>Test Page</div>,
  });

  const routeTree = rootRoute.addChildren([indexRoute, testRoute]);

  const history = createMemoryHistory({ initialEntries: ['/'] });

  const router = createRouter({
    routeTree,
    history,
  });

  return router;
}

export function renderWithRouter(component: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const router = createTestRouter(component);

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    ),
    router,
  };
}
