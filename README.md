# Ladder (Next.js)

Next 15 App Router, React 19, TypeScript, Tailwind 3, three.js. Static export, so it deploys to Vercel as a plain Next.js project.

    npm i
    npm run dev      # http://localhost:3000
    npm run build    # static site in out/

Routes: / (cinematic intro), /today, /weeks, /ladder/[py|cpp|java]/[topic], /courses/[220|250|320], /extras/[road], /log, /guide, /data.

Progress is stored in localStorage under `ladder-tracker-v1`, same schema as the earlier versions, so existing ticks, notes and hours carry over on the same domain.
