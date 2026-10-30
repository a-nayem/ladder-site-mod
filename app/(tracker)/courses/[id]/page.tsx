import { PageCourses } from "../../../../lib/views/courses";
import { DATA } from "../../../../data/data";
export const metadata = { title: "Courses" };
export const dynamicParams = false;
export function generateStaticParams() { return DATA.courses.map((c: any) => ({ id: c.id })); }
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PageCourses cid={id} />; }
