import Image from "next/image";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { BENEFITS } from "@/content/product";

/**
 * KAZANC DOKUMU (TASK-3.18, B-051).
 *
 * Bu bolum eskiden `sm:grid-cols-2 lg:grid-cols-4` uzerinde 8 ESIT KART
 * tasiyordu ve her kart `IconBox` + baslik + iki satir govdeydi. Bu,
 * STYLE-GUIDE -> Kullanicinin Refleksleri -> Kullanma maddesinin BIREBIR
 * tarifidir: "Jenerik ikonlu kart izgarasi (3xN esit kart, ikon + baslik +
 * iki satir)". Ayni maddenin Istiyor tarafi "duzen cesitliligi: her bolum
 * bir oncekinden farkli ritimde" diyor.
 *
 * Yerine gecen ritim DOKUMDUR, izgara degil: kart yok, yuzey dolgusu yok,
 * halka yok — bolumun kendi zemini gorunur ve kalemleri yalnizca sac teli
 * cizgiler ayirir. Satir ASIMETRIKTIR (lg'de 0,42 / 0,58): baslik solda
 * kendi kulvarinda, govde sagda. Ikon kutucugu (44x44 `IconBox`) dustu;
 * ikon basligin satir icinde kucuk bir isarete indi — dokuyu korur, karo
 * uretmez.
 *
 * SAYFADAKI KOMSULARINDAN DA AYRISIR (olcut STYLE-GUIDE'in kendi cumlesi):
 * onceki bolum `ProductStory` koyu zeminde yapiskan urun turudur, sonraki
 * bolum `WhyUs` iki sutunlu kart izgarasidir. Tam genislikte sac teli
 * dokum ana sayfada baska hicbir bolumde yok — oteki liste ritimleri
 * (Chaos, PricingBlock, Faq) hep iki sutunlu bir bolmenin DAR sutununda
 * yasiyor.
 *
 * FOTOGRAF: `salon-genis-wide.webp` (2000x760) foto hattinin kendi
 * notunda "Tam genislik bant icin" diye uretilmis ve bugune kadar HIC
 * kullanilmamisti (olculdu: grep, src/ altinda 0 cagri). Dokumun
 * ortasinda — dorduncu kalemin ardindan — bir nefes olarak duruyor ve
 * listenin tekduzeligini kiriyor. Uzerinde METIN YOK: kompozisyonlu
 * zemin kontrast payini yer (STYLE-GUIDE -> `faint`in AA payi), o yuzden
 * bant sessiz birakildi. Atmosferik, bilgi tasimiyor → `alt=""`.
 *
 * METIN TASINMADI: sekiz kalemin cumleleri `src/content/product.ts` ->
 * BENEFITS icinde, sirasi da degismedi. Bu bolum yalnizca duzendir.
 */

/** Fotograf bandi kacinci kalemin ARDINDAN gelir (0 tabanli sayimda 4. satir). */
const BANT_SONRASI = 4;

export function Benefits() {
  return (
    <Section tone="canvas" id="fayda">
      <SectionHead
        label="Salona ne kazandırır"
        title={
          <>
            Yazılım değişince <span className="text-gradient-sage">işletme değişir</span>
          </>
        }
        lead="Alpfit Plus bir takvim uygulaması değil. Kulübün para, kapasite ve üye tarafına aynı anda dokunur."
      />

      <div className="mt-12 border-t border-line">
        {BENEFITS.map((b, i) => (
          <div key={b.title}>
            <Reveal delay={(i % BANT_SONRASI) * 60}>
              {/*
                `min-w-0`: izgara cocugunun `min-width:auto` varsayilani 320 px'te
                icerigi sessizce kestiriyor (STYLE-GUIDE -> Duzen Tuzaklari).
                Basliktaki metin dugumu de kendi `span`'inda ve o da `min-w-0`.
              */}
              <article className="grid items-baseline gap-x-10 gap-y-1.5 border-b border-line py-6 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-x-12 lg:py-5">
                <h3 className="flex min-w-0 items-baseline gap-2.5 font-display text-lg font-bold leading-snug text-ink sm:text-xl">
                  <Icon
                    name={b.icon}
                    className="size-4.5 shrink-0 translate-y-0.5 text-sage-ink"
                    strokeWidth={1.9}
                  />
                  <span className="min-w-0">{b.title}</span>
                </h3>
                <p className="min-w-0 text-[0.9375rem] leading-relaxed text-muted">{b.body}</p>
              </article>
            </Reveal>

            {i === BANT_SONRASI - 1 ? (
              <Reveal>
                <figure className="my-8 overflow-hidden rounded-card ring-1 ring-line sm:my-9">
                  <Image
                    src="/foto/salon-genis-wide.webp"
                    alt=""
                    width={2000}
                    height={760}
                    // 640-1151 arasinda gercek slot `100vw` degil, kapsayici
                    // genisligi: @768 704 px olculdu (100vw - 2x px-8). Eski
                    // beyan orada %9 fazlasini soyluyordu (TASK-3.20).
                    sizes="(min-width: 1152px) 1088px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                    className="h-28 w-full object-cover object-center sm:h-40 lg:h-48"
                  />
                </figure>
              </Reveal>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}
