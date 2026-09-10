# Saf fonksiyon testi — repoda koşucu yok, Node tip soyması kullanılır

Bu repoda test koşucusu (Jest, Vitest) ve `tsx` **yok**; `package.json` betikleri
yalnız `dev` / `build` / `start` / `lint`. Yeni bağımlılık eklemeden bir saf
fonksiyonu sınamanın yolu Node'un yerleşik tip soymasıdır — konteynerdeki Node
sürümü `.ts` dosyasını doğrudan import edebilir.

Uygulanışı (TASK-1.01'de ölçüldü):

1. Test betiği `.mjs` olarak **repo dışında** yazılır (scratchpad) — repoya
   test dosyası bırakılmaz, çünkü projenin bir test düzeni yok.
2. `docker compose cp <betik> web:/tmp/…` ile konteynere kopyalanır.
3. `docker compose exec -T web node /tmp/<betik>` ile koşturulur; import yolu
   konteyner içi mutlak yoldur (`/app/src/lib/<dosya>.ts`).
4. Çıktı PASS/FAIL satırları basar ve task dokümanının **Test Sonuçları**
   alanına senaryo adlarıyla yazılır.

Node "MODULE_TYPELESS_PACKAGE_JSON" uyarısı basar; zararsızdır, `package.json`'a
`"type": "module"` eklemek için gerekçe değildir (Next yapılandırmasını etkiler).

Sonucu: yeni bir saf fonksiyon yazan her task kendi güvencesini bu yolla
getirebilir — "test koşucusu yok" testi atlama gerekçesi değildir
(Çalışma Prensipleri #7).

İlgili: `next.config.ts` → `env` ile gömülen bir değerin gerçekten gömüldüğünü
görmek bu yolla **kanıtlanamaz** — gömme yalnız değeri okuyan kod varsa çıktıya
girer, doğrulaması geçici bir tüketici (sonda rotası) ister.
