import os
import asyncio
import httpx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TuyBorBot")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8805612543:AAEEVJ9jfSy7h-JTNSd2nK4_h4Cw3fCqpIk")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"
WEB_APP_URL = "https://tuybor.uz/app"
LANDING_PAGE_URL = "https://tuybor.uz/"
APK_DOWNLOAD_URL = "https://tuybor.uz/download"
LOGO_URL = "https://tuybor.uz/static/apple-touch-icon.png"

async def setup_bot_menu():
    """
    Telegram botining chap pastki burchagidagi doimiy Menu tugmasiga
    Mini App havolasini avtomat o'rnatish.
    """
    async with httpx.AsyncClient() as client:
        payload = {
            "menu_button": {
                "type": "web_app",
                "text": "TuyBor Ilova",
                "web_app": {
                    "url": WEB_APP_URL
                }
            }
        }
        res = await client.post(f"{TELEGRAM_API_URL}/setChatMenuButton", json=payload)
        logger.info(f"SetChatMenuButton: {res.json()}")

async def send_welcome_message(chat_id: int):
    caption = (
        "Assalomu alaykum! 💍 **TuyBor** — O‘zbekistondagi eng yirik to‘y va tantanalar ekotizimiga xush kelibsiz!\n\n"
        "✨ **TuyBor imkoniyatlari:**\n"
        "• 🏰 **To‘yxonalar, San'atkorlar va Foto-Video** bazasi narxlari bilan;\n"
        "• 📍 **Jonli Xarita** orqali eng maqbul to'yxonalarni solishtirish;\n"
        "• 💰 **Aqlli Byudjet Kalkulyatori** orqali to'y xarajatlarini aniq hisoblash;\n"
        "• 💌 **Eksklyuziv Raqamli Taklifnoma** yaratish va mehmonlarga ulashish!\n\n"
        "Ilovadan foydalanish uchun quyidagi tugmalarni bosing 👇"
    )

    reply_markup = {
        "inline_keyboard": [
            [
                {
                    "text": "🚀 TuyBor Web Ilovasi",
                    "web_app": {"url": WEB_APP_URL}
                }
            ],
            [
                {
                    "text": "📲 Android APK Yuklab Olish",
                    "url": APK_DOWNLOAD_URL
                }
            ],
            [
                {
                    "text": "🌐 Rasmiy Veb-Sayt (tuybor.uz)",
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
        logger.info("TuyBor Telegram Bot ishga tushdi (@tuyborbot)...")
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
                                        "text": f"📲 **TuyBor Android APK:**\n\nQuyidagi tugma orqali rasmiy saytdan APK faylini yuklab olishingiz mumkin 👇",
                                        "parse_mode": "Markdown",
                                        "reply_markup": {
                                            "inline_keyboard": [
                                                [
                                                    {
                                                        "text": "📲 APK Yuklab Olish",
                                                        "url": APK_DOWNLOAD_URL
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
