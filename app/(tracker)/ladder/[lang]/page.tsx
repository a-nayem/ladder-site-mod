import { PageLadder } from "../../../../lib/views/ladder";
export const metadata = { title: "Ladder" };
export const dynamicParams = false;
export function generateStaticParams() { return ["py", "cpp", "java"].map((lang) => ({ lang })); }
export default async function Page({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; return <PageLadder lang={lang} />; }
