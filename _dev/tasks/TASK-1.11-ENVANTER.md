# TASK-1.11 — Tüketici Envanteri

← TASK-1.11.md · envanter (alt görev 3'ün tam kaydı; 2026-09-13 oturumu)

> Ölçüm zemini ve kaynak ayrımı parent'ın Oturum Kaydı → 0. maddesindedir: dashboard kanonik kopya `../Bunker OS/bunker-dashboard` (HEAD `99cf3ee`), canlı n8n ve şema `~/vps-yedekler/bunker-20260912-023004.dump` geri yüklemesi. Satır numaraları kanonik kopyaya aittir. "C" parent'taki kayıt biçimi seçeneğidir (ayrı tablo).

## Sayım

Dashboard'da `leads`'i SQL ile okuyan/yazan 56 dosya (çok satırlı tarama; verify-plan ~55), `staged_leads` 17 dosya. Prod n8n'de yayımlanmış düğümlerinde `leads` geçen aktif iş akışı 23, pasif 1; `staged_leads` geçen 1 (Alfred). crew-os `database.py:48-69` yalnız sayım SELECT'i.

## (a) Gönderen / eylem yapan — dashboard

Son sütun C önerisi içindir: satır her yolun okuduğu tabloyu gösterir, C tablosunu okuyan yol yok.

| Yol | Tetik | Seçim koşulu | C'ye girer mi |
|---|---|---|---|
| `outreach-sequence-tick` → `outreach-sequence.ts:267-276` → `hermes-send.ts:279-285` → `mailer.sendOutreach` | n8n günlük | `outreach_sequence status='pending' AND step=2 AND scheduled_for<=NOW()`, tenant filtresi yok. Lead: email dolu, `opted_out` değil, segment dolu. Gate `hermes-gate.ts:58-98`: ayar satırı yoksa izin, `paused` ise ret | Hayır: `outreach_sequence` okur. Satırını yalnız composer gönderimi yaratır (`drafts/[id]/send/route.ts:266` → `outreach-sequence.ts:53`) |
| `reply-poll-tick` → `bounce-match.ts:69-94`, `reply-match.ts:54-67` | 5 dk | `hermes_emails.message_id` eşleşmesi, yedek olarak son 30 gün `lower(email)` | Hayır: `hermes_emails` |
| `lead-classify-tick` → `classify.ts:75-95` | n8n 06:00, gövde `{}` → `kiwi` (`route.ts:44-47`) | leads: tenant, `updated_at<14g`, `pipeline_stage` açık, email dolu, bekleyen sınıflama yok → LLM | Hayır: `leads` |
| `triage-auto-approve` `route.ts:72-106` | n8n 06:15, `kiwi` | `lead_classifications verdict='archive' AND conf>=0.9` → `leads.pipeline_stage='archived'` | Hayır |
| `lead-pull-tick` → `pull-round.ts:198-203`, `sourcing.ts:391-400` | n8n 07:00 | `auto_enabled` kiracılar; dedupe leads ∪ staged pending → staged INSERT, asla onaylamaz | Hayır |
| `brain-tick` → `tools.ts:163-204`, `recommendations.ts:211-218` | Prod n8n'de zamanlanmış değil (47 iş akışında referans 0) | leads okur, öneri üretir; yürütme operatör onaylı | Hayır |
| `brain-auto-execute` / `-compliance` / `-weekly` | n8n | leads'e dokunmuyor | Hayır |
| Alfred `alfred-tool`: `lead_stage_batch` 644-723 · `lead_approve_batch` 738-786 (→ `staged_leads.ts:286-300`) · `lead_archive_bulk` 1494-1678 | Operatör sohbeti | staged/leads, id ya da filtre | Hayır |
| `drafts/generate` 34-74 · `drafts/[id]/send` 46-189, 238-277 · `outreach/batch.ts:41-44,118-136` · `outreach/next.ts:26-78` | Operatör | leads id / kiracı | Hayır |
| `staged/approve` → `staged_leads.ts:286-360` · `bulk-sequence` · `bulk-stage` · `bulk-triage` · `triage/bulk-approve` · `[id]/triage` · `chats/convert` 58-75 · `hermes-smoke` 64-75 · `mark-replied` · `unsubscribe` · `bulk-archive` | Operatör / manuel | id listesi ya da leads | Hayır |

## (a) Gönderen / eylem yapan — canlı n8n (döküm 2026-09-12)

Bunların hiçbirinde C tablosunun adı geçmiyor.

| İş akışı | Durum / tetik | Seçim / etki |
|---|---|---|
| `HERMES — Autonomous Loop (Daily)` | Aktif, 08:00 · 14 başarılı koşu | İç `POST /webhook/hermes-research` ve `/webhook/hermes-email` |
| `Hermes Researcher` | Aktif, webhook | `leads … email<>'' AND hermes_research yok AND status IN ('new','enriched') AND sequence_status='active'`, **tenant filtresi yok** → Claude araştırması + `hermes_research` INSERT. Pencerede kayıtlı koşusu yok |
| `Hermes Email Writer` | Aktif, webhook | `leads JOIN hermes_research … hermes_emails yok AND email NOT NULL`, **tenant filtresi yok** → taslak + Slack onayı |
| `Hermes Approval Callback` / `Content Approval Callback` | Aktif, webhook (Slack düğmesi) | `hermes_emails.id`'ye göre. Birincisi `leads.sequence_status='active'` yapar |
| `BUNKER — Batch Email Enrichment` | Aktif, webhook `batch-enrich` | `leads WHERE website dolu AND email boş`, tenant filtresi yok → leads UPDATE |
| `lead-intake-agent` → `Outreach Agent (GHL + Instantly)` | Aktif, webhook `lead-intake` / `outreach-test` | Yukarıdaki kırık INSERT; outreach `leads.status='contacted'` |
| `Cal.com Meeting Webhook` | Aktif, webhook | `kiwi` kiracısına leads upsert (`cal_direct`) |
| `Smart Email Monitor` / `Hermes Reply Handler` | Aktif, gmailTrigger | leads INSERT (`manual_email`) / e-postaya göre `opted_out`. Pencerede koşu kaydı yok |
| `BUNKER — Hermes Sequence Sender (Auto)` | **Pasif** | `kiwi` sabit, `sequence_status='active'` → Gmail |
| `Apollo CSV Import`, `Lead Generation v3` | Aktif, webhook | leads INSERT |

## (b) Rapor / metrik

C seçilirse hiçbirine karışmaz; A seçilirse hepsine karışır, çünkü hiçbirinde `source` filtresi yok:

- `reports/page.tsx:78-86`, `funnel.ts:110-124,225-270`
- `daily/briefing.ts:194-195,282-318`, `feed.ts:41-51`, `app/page.tsx:80-84,237-247`
- `tenant-performance.ts:23-34`, `ops-pipeline.ts:116-155` (tenant filtresiz), `readiness.ts:367-373`
- `leads/page.tsx:65-121`, `kanban/page.tsx:42-165`, `stale-triage-card.tsx:57-71`, `segments.ts:159-227`

B seçilirse: `briefing.ts:179-180`, `ops-pipeline.ts:25-31`, inceleme kuyruğu. n8n'de sayım yapanlar: Sentinel, CRM Dashboard, Ops Daily Report, Weekly Metrics, CREW OS Athena/Commander/Hermes Director/Orion, Alfred "Get DB Stats", Chat Agent v3 araçları.

## (c) KVKK hakları

- `api/leads/gdpr-delete`: yalnız kiwi admin (`:23`). Eşleşme e-postayla ve kiracı kapsamında. **Leads satırı yoksa erken döner** (`:51-53`). Sabit tablo listesini siler (`:72-97`); `staged_leads` silmesinde `LOWER` yok.
- `api/leads/export`: oturumlu herkes, yalnız `leads` tablosu (`:94-98`).
- C tablosu ikisine de girmez. Uzatılmaları Bunker'da iş; o yapılana kadar elle prosedür gerekir (TASK-1.15 girdisi).

## Kendiliğinden bildirim

Dashboard'da leads/staged INSERT'inde Slack ya da mail yok, yalnız `audit_log` (`slack.ts` çağıranları: reply-poll ve app-errors). n8n'de "yeni lead" Slack mesajı yalnız bu yolda olmayan akışlarda (Smart Email Monitor, CSV/Lead Gen). **Çift bildirim doğmaz.**

## Hermes ve yönlendirme

`alpfit` için gate açık (`paused=false`). Kod garantisi `OUTREACH_REDIRECT_TO`: `mailer.ts:147-151,350-361`; prod env'de dolu olduğu devralındı (Bunker memory), ölçülmedi.
