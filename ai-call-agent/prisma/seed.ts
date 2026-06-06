import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed verileri oluşturuluyor...");

  // Örnek kişiler
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: "Ahmet Yılmaz",
        phone: "+905551001001",
        email: "ahmet@example.com",
        company: "ABC Teknoloji",
        title: "CTO",
        status: "NEW",
        tags: ["teknoloji", "startup"],
      },
    }),
    prisma.contact.create({
      data: {
        name: "Fatma Demir",
        phone: "+905551002002",
        email: "fatma@example.com",
        company: "XYZ Yazılım",
        title: "CEO",
        status: "NEW",
        tags: ["yazılım", "kurumsal"],
      },
    }),
    prisma.contact.create({
      data: {
        name: "Mehmet Kaya",
        phone: "+905551003003",
        email: "mehmet@example.com",
        company: "Kaya İnşaat",
        title: "Genel Müdür",
        status: "NEW",
        tags: ["inşaat"],
      },
    }),
    prisma.contact.create({
      data: {
        name: "Ayşe Çelik",
        phone: "+905551004004",
        email: "ayse@example.com",
        company: "Çelik Danışmanlık",
        title: "Kurucu",
        status: "NEW",
        tags: ["danışmanlık", "finans"],
      },
    }),
    prisma.contact.create({
      data: {
        name: "Ali Öztürk",
        phone: "+905551005005",
        email: "ali@example.com",
        company: "Öztürk Ticaret",
        title: "Satış Müdürü",
        status: "NEW",
        tags: ["ticaret", "e-ticaret"],
      },
    }),
  ]);

  console.log(`${contacts.length} kişi oluşturuldu`);

  // Hafıza öğeleri
  const memories = await Promise.all([
    prisma.memory.create({
      data: {
        category: "firma",
        key: "Firma Adı",
        content: "HireNUp - Profesyonel hizmetler platformu",
        priority: 10,
      },
    }),
    prisma.memory.create({
      data: {
        category: "firma",
        key: "Çalışma Saatleri",
        content: "Pazartesi-Cuma 09:00-18:00 arası hizmet veriyoruz",
        priority: 5,
      },
    }),
    prisma.memory.create({
      data: {
        category: "urun",
        key: "Ana Hizmet",
        content:
          "Freelancer, girişimci, işveren ve yatırımcıları bir araya getiren profesyonel platform",
        priority: 10,
      },
    }),
    prisma.memory.create({
      data: {
        category: "urun",
        key: "Özellikler",
        content:
          "İş ilanları, freelancer profilleri, şirket yönetimi, yatırım platformu, AI proje asistanı",
        priority: 8,
      },
    }),
    prisma.memory.create({
      data: {
        category: "fiyat",
        key: "Üyelik Planları",
        content:
          "Silver (temel), Gold (gelişmiş), Platinum (premium), Prime (kurumsal) olmak üzere 4 plan mevcuttur",
        priority: 8,
      },
    }),
    prisma.memory.create({
      data: {
        category: "sss",
        key: "Ücretsiz Deneme",
        content: "Evet, 14 günlük ücretsiz deneme süresi sunuyoruz",
        priority: 7,
      },
    }),
    prisma.memory.create({
      data: {
        category: "itiraz",
        key: "Pahalı Bulunursa",
        content:
          "Yatırımın geri dönüşünü vurgula. Platforma katılan firmalar ortalama %30 daha fazla proje alıyor",
        priority: 9,
      },
    }),
    prisma.memory.create({
      data: {
        category: "itiraz",
        key: "Zaman Yoksa",
        content:
          "Anlıyorum, herkes meşgul. Size sadece 2 dakika ayırmanızı rica ediyorum. Kısa bir demo ile gösterebiliriz",
        priority: 9,
      },
    }),
    prisma.memory.create({
      data: {
        category: "senaryo",
        key: "Randevu Alma",
        content:
          "İlgi gösteren müşterilere online demo randevusu öner. Salı ve Perşembe günleri 14:00-16:00 arası demo slotları mevcut",
        priority: 10,
      },
    }),
  ]);

  console.log(`${memories.length} hafıza öğesi oluşturuldu`);

  // Agent yapılandırması
  const agentConfig = await prisma.agentConfig.create({
    data: {
      name: "Varsayılan Satış Ajanı",
      personality:
        "Samimi, profesyonel ve çözüm odaklı bir satış temsilcisi. Müşterinin ihtiyaçlarını dinler ve en uygun çözümü sunar.",
      greeting:
        "Merhaba {{name}}, ben HireNUp platformundan arıyorum. Nasılsınız? Kısa bir sürenizi alabilir miyim?",
      objective:
        "Müşteriye HireNUp platformunu tanıtmak, ilgi uyandırmak ve online demo randevusu almak",
      instructions: `- Müşteriyi dinle, ihtiyaçlarını anla
- Platformun faydalarını müşterinin sektörüne göre anlat
- Fiyat sorulursa önce değer önerisini anlat, sonra plan seçeneklerini sun
- İtirazları empati ile karşıla
- İlgi varsa mutlaka demo randevusu öner
- Konuşmayı 3-5 dakika arasında tut`,
      voiceId: "alloy",
      language: "tr-TR",
      maxCallDuration: 300,
      isActive: true,
    },
  });

  console.log(`Agent yapılandırması oluşturuldu: ${agentConfig.name}`);
  console.log("\nSeed tamamlandı!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
