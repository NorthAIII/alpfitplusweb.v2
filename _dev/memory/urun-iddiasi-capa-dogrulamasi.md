# Ürün iddiası düzeltilirken bulgu yeniden ölçülür — ürünün kendi notu çapa değildir

**Ne zaman uygulanır:** Sitedeki bir yetenek iddiasını `../Alpfit.v1`'e (salt okunur ürün kodu) karşı doğrulayan ya da düzelten her iş — B-029 sınıfı, `CAPABILITIES` kademeleri, TASK-2.12/2.14/2.15 gibi iddia taramaları, ileride M6 F6.4'ün sızıntı denetimi.

## Kural

**Dört ayrı kural, dördü de zorunlu:**

1. **Devralınan bulgu tablosu uygulanmadan önce yeniden ölçülür.** Ürün deposu bu sitenin fazlarından bağımsız ilerliyor; bir bulgu yazıldıktan sonra ürün o boşluğu kapatmış olabilir. Ölçüm ucuz, yanlış düzeltme pahalı — çünkü "düzeltme" bu projede *doğru bir cümleyi bozmak* anlamına gelebilir.
2. **Ürünün kendi erteleme notu (`v1.5` · `Yakında` · `ertelendi` · `W8`) tek başına kanıt değildir.** Not, kodu değişince güncellenmiyor. Karşılığı **çağrı grafiğiyle** doğrula: fonksiyonun üretim çağıranı var mı, çağıran bir HTTP ucuna bağlı mı, uç `server.ts`'te kayıtlı mı, paneli çağırıyor mu.

3. **Sitede bir SÜRÜM NUMARASI iddiası varsa çapası `../Alpfit.v1/_dev/PRD/VERSIONS.md`'dir** — kod yorumu değil. O dosya kendini *"Bu dosya source of truth"* ilan ediyor ve v1 / v1.5 / v2 kapsamlarını tablo hâlinde tutuyor. Kod yorumundaki *"v1.5 adayı"* bir **kapsam taahhüdü değildir**; bir kalemin ertelenmiş olması onu sıradaki sürümün kapsamına sokmaz.

4. **YERİNE yazdığın iddia da ölçülür — ve onu çivileyen kapı elle listeden değil gerçeğin kaynağından türetilir.** Bir karşılıksız cümleyi silmek işin yarısı; yerine gelen cümle de bir iddiadır ve aynı kapıdan geçmelidir. Elle yazılmış bir `toContain(...)` listesi burada **koruma değil kilittir**: yanlış cümleyi sabitler ve sonraki turlara "ölçülmüş" diye görünür.

## Neden — ölçülmüş iki hâl (TASK-2.09, 2026-09-23)

**B-029'un 4. satırı bu iki kuralın ikisinden de düştü ve yanlıştı.**

- Bulgu `revokeGrant`'in çağıranına bakıp *"üretim çağıranı yok → yetki panelden geri alınamaz"* demişti. Doğru ama eksik: geri alma üretimde **`revokeTemplate`** üzerinden koşuyor — `accounts-update.ts:861` → `revokeTemplate` → `revokeGrant` → `permissionGrant.deleteMany`; uç `PATCH /accounts/:userId` (`server.ts:375`), paneli `web/src/lib/account-mutations.ts`. Araya ürünün TASK-54.11 REPLACE yolu girmişti.
- Ürünün **kendi notu da bayattı**: `permission-templates.ts:15-17` hâlâ *"revoke HTTP endpoint'i v1.5'e ertelendi … hesap silme / rol değişimi yolları da bundan **geçecek**"* diyor — gelecek kipiyle. `accounts-update.ts` bugün geçiyor.

Sonuç: plan o cümleyi "daraltmayı" öngörüyordu; ölçüm cümlenin **doğru** olduğunu gösterdi ve cümle yerinde bırakıldı. Ölçülmeseydi site *daha yanlış* hâle gelecekti.

**Aynı turda ikinci bir sayı da kaymıştı** (zararsız ama aynı sebep): `notification.service.ts`'in gönderim fonksiyonu sayısı bulguda 12, ölçümde **14** — ürün iki bildirim tipi eklemiş. Hüküm değişmedi (hiçbiri hâlâ üyelik bitişi değil), ama dokümana yazılan rakam ölçümden gelir, bulgudan değil.

## Neden — 3. kural (TASK-2.10, 2026-09-23)

Kurucu Programı kartı *"v1.5 yolda"* diyordu ve plan onu `PRODUCT_STATUS.nextVersion`'a bağlamayı devretmişti. Bağlamadan önce `VERSIONS.md` okundu:

- ürünün **v1.5** kapsamı = kampanya derinleşmesi · gelişmiş raporlama/Excel · bekleme listesi otomasyonu · churn paneli olgunlaşması → sitenin `yolda` kademesinin **yalnız ilk üçü**
- ürünün **v2** kapsamı = sitenin `sonra` kademesinin **beşi de, birebir** (kullanışlı çapa: o kademe için sürüm adı gerekirse "v2" doğrudur)
- `yolda`'ya sonradan taşınan **dört B-029 kalemi** haritanın **hiçbir satırında yok** — ikisinin kod yorumunda "v1.5 adayı" yazması yetmiyor

Yani kademe bir sürümün kapsamı değil; yedisine "v1.5" demek B-029'un kendi hatasını yeniden üretirdi. Kart başlığı sürüm numarası yerine `STAGE_LABEL`'a bağlandı ve `nextVersion` **hiç açılmadı** (karar: `docs/DECISIONS.md` 2026-09-23).

## Neden — 4. kural (TASK-2.13, 2026-09-23)

TASK-2.12, antrenör ürün görselinin `alt` metnindeki karşılıksız *"öğrenci tutma"* ifadesini doğru biçimde düşürdü — ama **yerine** *"aylık performans, **haftalık doluluk** ve **ciro kırılımı**"* yazdı ve son ikisini `tests/iddia-metinleri.test.ts`'te `toContain` ile **çiviledi**.

Bir tur sonra ölçüldü: o iki kart bu görüntüde **zaten yok.** Aynı üretim hattı onları **TASK-14.06'dan beri** düşürüyor (`DROP_NODES.antrenor`) ve gerekçesi ürünün kendi kodu — `trainer-performance.service.ts:7` *"FİNANSAL CİRO DEĞİL"*, `attendance-count.ts:11` doluluk % kapsam dışı. Yani düzeltme **bir karşılıksız iddiayı ikisiyle değiştirdi** ve üstüne bir kapı koyarak sabitledi; kapı yeşil olduğu için de "ölçülmüş" görünüyordu.

Kaçıran şey yöntemdi: yeni cümle **görüntüye karşı değil, beklentiye karşı** yazılmıştı. Çare kapının kaynağını değiştirmek oldu — kural artık *"alt metin, hattın o ekrandan **düşürdüğü** hiçbir kartı anamaz"* ve çapalar hattın kendi `DROP_NODES`/`SHELL_DROP_NODES` tablosundan okunuyor (`tests/iddia-metinleri.test.ts` → `research/lib/screen-cleanup-v2.mjs` import'u; `web` konteyneri deponun tamamını görür, araştırma konteyneri yalnız `research/`ü — bağ bu yüzden tek yönlü). Elle yazılan üç `toContain` bu kuralla değiştirildi; sonda, eski metni geri yazınca kırmızı verdiğini doğruladı.

## Pratik ölçüm deseni

```bash
# 1) Fonksiyonun GERCEK cagirani var mi (yorum ve test haric)
grep -rnE "fnAdi\s*\(" backend/src web/src | grep -v "\.test\."
# 2) Cagiran bir uca bagli mi, uc kayitli mi
grep -n "app\.\(get\|post\|patch\|put\|delete\)(" backend/src/routes/<dosya>.ts
grep -n "<rotaAdi>" backend/src/server.ts
# 3) Panel/mobil gercekten cagiriyor mu
grep -rn "<yol>" web/src/lib mobile/src/api
```

⚠️ **Yorum satırları `grep`'te çağrı gibi görünür** — 4. satırı yanlış yapan tuzağın ikinci yarısı buydu: `revokeGrant` geçen 20+ satırın hepsi yorum ya da testti, tek gerçek çağrı başka bir isimdeydi (`revokeTemplate`).

## Sınır

Bu kural "her şeyi baştan ölç" demek değil. Ölçülen, **düzeltilecek kalemin kendisidir**; bulgunun geri kalanı kapsamı genişletmez (kapsam genişletme yasağı task dokümanlarında ayrıca yazılı). Ölçüm çeliştiğinde bulgu atomunun ilgili satırı **düzeltilir** ve gerekçesi Çözüm Kaydı'na yazılır — bulgu yaşayan dokümandır.
