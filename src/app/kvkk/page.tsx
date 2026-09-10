import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { KVKK } from "@/content/legal";

export const metadata: Metadata = {
  title: KVKK.title,
  description: KVKK.description,
  alternates: { canonical: "/kvkk" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <LegalPage doc={KVKK} />;
}
