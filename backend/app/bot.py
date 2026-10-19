import asyncio
import httpx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TuyxonaBot")

BOT_TOKEN = "8643800096:AAFRH_zRmRouQOWDHt0Q18DBi0w-iCPyG3c"
TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"
WEB_APP_URL = "https://tuybox.asilbek.tech"
LANDING_PAGE_URL = "https://tuybox.asilbek.tech/pitch"
APK_DOWNLOAD_URL = "https://tuybox.asilbek.tech/download"
LOGO_URL = "https://tuybox.asilbek.tech/static/logo.jpg"

async def setup_bot_menu():
    """
    Telegram botining chap pastki burchagidagi doimiy Menu tugmasiga
    Mini App havolasini avtomat o'rnatish.
    """
    async with httpx.AsyncClient() as client:
        payload = {
            "menu_button": {
                "type": "web_app",
                "text": "TuyBox",
                "web_app": {
                    "url": WEB_APP_URL
                }
            }
        }
        res = await client.post(f"{TELEGRAM_API_URL}/setChatMenuButton", json=payload)
        logger.info(f"SetChatMenuButton: {res.json()}")

async def send_welcome_message(chat_id: int):
    caption = (
        "Assalomu alaykum! 💍 **TuyBox** — O‘zbekistondagi eng qulay to‘y va marosimlar platformasiga xush kelibsiz!\n\n"
        "✨ **TuyBox imkoniyatlari:**\n"
        "• 🏰 **500+ Sara To‘yxonalar** va sanʼatkorlar katalogi;\n"
        "• 📍 **Jonli Xarita** orqali eng yaqin to'yxonalarni topish va narxlarni solishtirish;\n"
        "• 💰 **To‘y Byudjeti** kalkulyatori bilan xarajatlarni aniq hisoblash;\n"
        "• 💌 **Raqamli to‘y taklifnomasi** yaratib, yaqinlarga ulashish!\n\n"
        "Platformaga kirish yoki mobil ilova landing sahifasini ko'rish uchun quyidagi tugmalarni bosing 👇"
    )

    reply_markup = {
        "inline_keyboard": [
            [
                {
                    "text": "🚀 Kirish",
                    "web_app": {"url": WEB_APP_URL}
                }
            ],
            [
                {
                    "text": "📲 APK Yuklab Olish",
                    "url": LANDING_PAGE_URL
                }
            ]
        ]
    }

    async with httpx.AsyncClient() as client:
        # Avval chiroyli logo rasmi bilan yuboramiz
        res = await client.post(
            f"{TELEGRAM_API_URL}/sendPhoto",
            json={
                "chat_id": chat_id,
                "photo": LOGO_URL,
                "caption": caption,
                "parse_mode": "Markdown",
                "reply_markup": reply_markup
            }
        )
        if not res.json().get("ok"):
            # Rasm ketmasa oddiy text sifatida yuboramiz
            await client.post(
                f"{TELEGRAM_API_URL}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": caption,
                    "parse_mode": "Markdown",
                    "reply_markup": reply_markup
                }
            )

async def start_bot_polling():
    """
    Asinxron Telegram Bot Polling (Lightweight, hechnarsa buzilmaydi).
    """
    async with httpx.AsyncClient(timeout=35.0) as client:
        # Avval eski yoki noto'g'ri webhooklarni tozalaymiz (409 Conflict oldini olish)
        try:
            await client.post(f"{TELEGRAM_API_URL}/deleteWebhook", params={"drop_pending_updates": True})
            logger.info("Webhook tozalandi, getUpdates polling faollashtirildi.")
        except Exception as e:
            logger.warning(f"Webhook tozalashda ogohlantirish: {e}")

        await setup_bot_menu()
        logger.info("Tuyxona Telegram Bot ishga tushdi (@tuyboxbot)...")
        offset = 0
        while True:
            try:
                response = await client.get(
                    f"{TELEGRAM_API_URL}/getUpdates",
                    params={"offset": offset, "timeout": 25}
                )
                data = response.json()
                if data.get("ok"):
                    for update in data.get("result", []):
                        offset = update["update_id"] + 1
                        message = update.get("message")
                        if message and "text" in message:
                            text = message["text"]
                            chat_id = message["chat"]["id"]
                            if text.startswith("/start"):
                                await send_welcome_message(chat_id)
                            elif text.startswith("/apk"):
                                await client.post(
                                    f"{TELEGRAM_API_URL}/sendMessage",
                                    json={
                                        "chat_id": chat_id,
                                        "text": f"📲 **TuyBox Android APK:**\n\nQuyidagi tugma orqali rasmiy landing sahifasidan APK faylini yuklab olishingiz mumkin 👇",
                                        "parse_mode": "Markdown",
                                        "reply_markup": {
                                            "inline_keyboard": [
                                                [
                                                    {
                                                        "text": "📲 APK Yuklab Olish",
                                                        "url": LANDING_PAGE_URL
                                                    }
                                                ]
                                            ]
                                        }
                                    }
                                )
            except Exception as e:
                logger.error(f"Bot xatosi: {e}")
                await asyncio.sleep(3)

if __name__ == "__main__":
    asyncio.run(start_bot_polling())
