This is a nextjs whiteboard app tutorial project integrated with Clerk, Convex, and Liveblocks, which is taught by [Antonio](https://github.com/AntonioErdeljac/), and you can find the [tutorial video](https://youtu.be/ADJKbuayubE?si=3H_FV09ym11ANP3m) here.

## Getting Started

Creating a file `.env.local`, and configuring the following environment variables. You can find the configuration steps in the following links:

- [Clerk](https://clerk.com/)
- [Convex](https://convex.dev/)
- [Liveblocks](https://liveblocks.io/)

```txt
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# for clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# for liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY=
NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY=
```

run the development server:

```bash
npm run dev
```
and the convex dev server:

```bash
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

