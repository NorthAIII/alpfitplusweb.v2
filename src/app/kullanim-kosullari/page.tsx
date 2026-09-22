import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { TERMS } from "@/content/legal";

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function Page() {
  return <LegalPage doc={TERMS} />;
}
