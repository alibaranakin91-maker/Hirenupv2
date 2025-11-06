import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, projectId, userId, context, conversationHistory } = await req.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    // Save user message
    const userChat = await prisma.aIChat.create({
      data: {
        message,
        messageType: "user",
        userId,
        projectId: projectId || null,
        context: context || {},
      },
    })

    // Get project context if available
    let projectContext = null
    if (projectId) {
      projectContext = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          entrepreneur: true,
          company: true,
        },
      })
    }

    // Prepare AI prompt
    const systemPrompt = `Sen Hirenup platformunun AI proje asistanısın. Girişimcilere ve şirket yöneticilerine proje planlaması, bütçe yönetimi ve ekip kurma konusunda yardımcı oluyorsun.

Senin görevlerin:
1. Proje için yapılması gerekenleri adım adım açıklamak
2. Bütçe planlaması konusunda rehberlik etmek
3. Projeye uygun çalışan/freelancer önerileri sunmak
4. Proje yönetimi ve zaman çizelgesi konusunda tavsiyeler vermek

Türkçe yanıt ver. Profesyonel ama samimi bir dil kullan.`

    const userPrompt = `Proje Bilgileri:
${projectContext ? `
- Proje Adı: ${projectContext.name}
- Açıklama: ${projectContext.description}
- Bütçe: ${projectContext.budget ? `₺${projectContext.budget.toLocaleString()}` : "Belirtilmemiş"}
- Endüstri: ${projectContext.industry || "Belirtilmemiş"}
- Durum: ${projectContext.status}
` : "Yeni proje oluşturuluyor"}

Kullanıcı Sorusu: ${message}

${conversationHistory && conversationHistory.length > 0 ? `
Önceki Konuşma:
${conversationHistory.map((m: any) => `${m.role}: ${m.content}`).join("\n")}
` : ""}

Lütfen kullanıcının sorusunu yanıtla ve gerekirse proje planlaması, bütçe veya ekip önerileri sun.`

    // Call AI service (OpenAI API or similar)
    // For now, we'll use a mock response. In production, integrate with OpenAI API
    const aiResponse = await generateAIResponse(systemPrompt, userPrompt, projectContext)

    // Save AI response
    const aiChat = await prisma.aIChat.create({
      data: {
        message: message,
        response: aiResponse,
        messageType: "assistant",
        userId,
        projectId: projectId || null,
        context: context || {},
      },
    })

    return NextResponse.json({
      response: aiResponse,
      chatId: aiChat.id,
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Mock AI response generator - Replace with actual OpenAI API call in production
async function generateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  projectContext: any
): Promise<string> {
  // This is a mock implementation. In production, replace with actual OpenAI API:
  /*
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  })
  return completion.choices[0].message.content || ""
  */

  // Mock response based on common questions
  const message = userPrompt.toLowerCase()
  
  if (message.includes("bütçe") || message.includes("maliyet") || message.includes("fiyat")) {
    return `Bütçe planlaması için şu adımları izlemenizi öneririm:

1. **Proje Kapsamını Belirleyin**: 
   - Hangi özellikler minimum gereklidir (MVP)?
   - Hangi özellikler sonraya bırakılabilir?

2. **Kaynak İhtiyacını Hesaplayın**:
   - Geliştirme ekibi (frontend, backend, tasarım)
   - Altyapı ve hosting maliyetleri
   - Pazarlama ve tanıtım bütçesi
   - Yasal ve danışmanlık giderleri

3. **Bütçe Dağılımı** (Önerilen):
   - Geliştirme: %50-60
   - Pazarlama: %20-30
   - Altyapı: %10-15
   - Acil durum fonu: %10-15

${projectContext?.budget ? `
Projenizin mevcut bütçesi: ₺${projectContext.budget.toLocaleString()}
Bu bütçeye göre size özel bir planlama yapabilirim. Hangi alan hakkında daha detaylı bilgi istersiniz?
` : "Bütçenizi belirtirseniz, size daha spesifik öneriler sunabilirim."}`
  }

  if (message.includes("çalışan") || message.includes("ekip") || message.includes("freelancer") || message.includes("kim çalışmalı")) {
    return `Projeniz için ekip oluştururken şu rollere ihtiyacınız olabilir:

**Temel Ekip Yapısı:**

1. **Proje Yöneticisi** (PM)
   - Proje planlaması ve takibi
   - Ekip koordinasyonu
   - Bütçe: ₺15,000-30,000/ay veya ₺500-1,000/saat

2. **Geliştirici(lar)**
   - Frontend Developer (React/Next.js)
   - Backend Developer (Node.js/Python)
   - Bütçe: ₺20,000-50,000/ay veya ₺800-2,000/saat

3. **Tasarımcı**
   - UI/UX Designer
   - Bütçe: ₺10,000-25,000/ay veya ₺400-1,000/saat

4. **Diğer Roller** (İhtiyaca göre):
   - DevOps Engineer
   - QA Tester
   - Pazarlama Uzmanı

${projectContext?.budget ? `
Bütçenize (₺${projectContext.budget.toLocaleString()}) göre size uygun freelancer ve çalışan önerileri sunabilirim. Hangi rolle başlamak istersiniz?
` : "Bütçenizi belirtirseniz, size en uygun çalışan önerilerini sunabilirim."}

**Not**: Platformumuzda bütçenize uygun freelancer'ları filtreleyebilir ve doğrudan iletişime geçebilirsiniz.`
  }

  if (message.includes("yapılması gereken") || message.includes("adım") || message.includes("plan") || message.includes("ne yapmalı")) {
    return `Projeniz için yapılması gerekenler:

**1. Faza: Planlama ve Hazırlık**
   - Proje gereksinimlerini detaylandırın
   - Teknik mimariyi tasarlayın
   - Zaman çizelgesi oluşturun
   - Bütçe planlaması yapın

**2. Faza: Ekip Kurulumu**
   - Gerekli rolleri belirleyin
   - Freelancer veya çalışan arayın
   - Ekip üyelerini işe alın

**3. Faza: Geliştirme**
   - MVP (Minimum Viable Product) geliştirin
   - Test ve iyileştirmeler yapın
   - Düzenli geri bildirim toplayın

**4. Faza: Lansman**
   - Ürünü yayınlayın
   - Pazarlama kampanyaları başlatın
   - Kullanıcı desteği kurun

**5. Faza: İyileştirme**
   - Kullanıcı geri bildirimlerini değerlendirin
   - Yeni özellikler ekleyin
   - Ölçeklendirme planları yapın

${projectContext ? `
Projenizin mevcut durumu: ${projectContext.status}
Hangi fazda olduğunuzu belirtirseniz, o faz için daha detaylı rehberlik sunabilirim.
` : "Hangi aşamada olduğunuzu belirtirseniz, size daha spesifik adımlar sunabilirim."}`
  }

  // Default response
  return `Merhaba! Projeniz hakkında size nasıl yardımcı olabilirim?

Size şu konularda destek sunabilirim:
- 📋 Proje planlaması ve yapılacaklar listesi
- 💰 Bütçe planlaması ve maliyet tahmini
- 👥 Ekip kurma ve çalışan önerileri
- 📅 Zaman çizelgesi oluşturma
- 🎯 MVP stratejisi

Hangi konuda yardıma ihtiyacınız var?`
}

