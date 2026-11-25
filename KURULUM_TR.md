# GarajNotları AI Studio — Türkçe Kurulum

Bu proje telefon tarayıcısından kullanılabilen bir web uygulamasıdır. OpenAI API anahtarı yalnızca sunucuda tutulur.

## Replit ile kurulum
1. https://replit.com adresinde hesap aç.
2. Yeni bir Node.js projesi oluştur.
3. ZIP içindeki `package.json`, `server.js` ve `public` klasörünü projeye yükle.
4. Replit'te Tools → Secrets bölümünü aç.
5. `OPENAI_API_KEY` adında secret oluştur ve OpenAI Platform'dan aldığın API anahtarını değer olarak ekle.
6. İstersen `OPENAI_MODEL` secret'ı ekleyip hesabında erişimin olan Responses API modelini belirt. Varsayılan model `gpt-5.5`.
7. Run düğmesine bas; uygulama `npm start` ile başlar.
8. Replit'in verdiği web adresini Android Chrome'da aç. Chrome menüsünden “Ana ekrana ekle” seç.

## API anahtarı
https://platform.openai.com/api-keys adresinden oluştur. Anahtarı HTML dosyasına, sohbetlere veya herkese açık kodlara yazma. API kullanımı ChatGPT aboneliğinden ayrı ücretlendirilir.

## Özellikler
- Tam seslendirme senaryosu
- Zaman kodlu sahne planı ve stok görüntü arama kelimeleri
- Başlıklar ve YouTube açıklaması
- Thumbnail konsepti ve görsel üretim promptu
- 3 Shorts fikri
- Teknik doğrulama notları
- TXT ve JSON indirme

## Sınırlamalar
İlk sürüm otomatik web araştırması yapmaz; yayın öncesi teknik kontrol notlarını güvenilir kaynaklarla doğrula. Görüntü lisanslarını kontrol et. Uygulamada kullanıcı hesabı yoktur; bağlantıyı herkese açık dağıtma. Replit'te API anahtarını yalnızca Secrets bölümünde tut.
