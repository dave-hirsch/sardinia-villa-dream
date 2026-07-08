import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Toaster } from "@/components/ui/sonner";

import "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-sand">
      <Header />
      <div className="max-w-2xl mx-auto text-center py-32 px-6">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-serif text-5xl text-sea mb-4">Page not found</h1>
        <p className="text-olive/80 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-block bg-sea text-sand px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90"
        >
          Return home
        </Link>
      </div>
      <Footer />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen bg-sand">
      <Header />
      <div className="max-w-2xl mx-auto text-center py-32 px-6">
        <p className="eyebrow mb-4">Something went wrong</p>
        <h1 className="font-serif text-4xl text-sea mb-4">This page didn't load</h1>
        <p className="text-olive/80 mb-8">Please try again, or head back home.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-sea text-sand px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90"
          >
            Try again
          </button>
          <a href="/" className="border border-black/15 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:border-clay hover:text-clay">
            Go home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "My Sardinian Villa · Private villas in southern Sardinia" },
      { name: "description", content: "A small, personally chosen collection of private villas across southern Sardinia. Enquiries answered by Marion within 24 hours." },
      { name: "author", content: "My Sardinian Villa" },
      { property: "og:title", content: "My Sardinian Villa · Private villas in southern Sardinia" },
      { property: "og:description", content: "A small, personally chosen collection of private villas across southern Sardinia. Enquiries answered by Marion within 24 hours." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "My Sardinian Villa" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "My Sardinian Villa · Private villas in southern Sardinia" },
      { name: "twitter:description", content: "A small, personally chosen collection of private villas across southern Sardinia. Enquiries answered by Marion within 24 hours." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/958d4cb6-c674-4844-b0e1-18d29bbae529/id-preview-fa2f80e4--1d6c97d6-f59d-4a38-85db-af7943933b2d.lovable.app-1783511337448.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/958d4cb6-c674-4844-b0e1-18d29bbae529/id-preview-fa2f80e4--1d6c97d6-f59d-4a38-85db-af7943933b2d.lovable.app-1783511337448.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "My Sardinian Villa",
          description: "Private villas across the south of Sardinia, personally chosen by Marion.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-sand">
        <Header />
        <main className="flex-1"><Outlet /></main>
        <Footer />
        <CookieBanner />
      </div>
    </QueryClientProvider>
  );
}
