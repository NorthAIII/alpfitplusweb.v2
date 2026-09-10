import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { PRIVACY } from "@/content/legal";

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: { canonical: "/gizlilik" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <LegalPage doc={PRIVACY} />;
}
