import { PageExtras } from "../../../../lib/views/extras";
export const metadata = { title: "Extra steps" };
export const dynamicParams = false;
export function generateStaticParams() { return ["py", "cpp", "java", "ai"].map((road) => ({ road })); }
export default async function Page({ params }: { params: Promise<{ road: string }> }) { const { road } = await params; return <PageExtras road={road} />; }
