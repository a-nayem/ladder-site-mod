import { PageLadder } from "../../../../../lib/views/ladder";
import { DATA } from "../../../../../data/data";
export const metadata = { title: "Ladder" };
export const dynamicParams = false;
export function generateStaticParams() {
  const out: { lang: string; n: string }[] = [];
  ["py", "cpp", "java"].forEach((lang) => DATA.ladders[lang].forEach((t: any) => out.push({ lang, n: String(t.n) })));
  return out;
}
export default async function Page({ params }: { params: Promise<{ lang: string; n: string }> }) { const { lang, n } = await params; return <PageLadder lang={lang} n={+n} />; }
