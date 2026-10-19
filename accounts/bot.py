import os
import requests
from aiogram import Bot, Dispatcher, types
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup
from aiogram.filters import Command
from aiogram import F
from dotenv import load_dotenv

load_dotenv()

# Django webhook URL
DJANGO_WEBHOOK_URL = os.getenv("DJANGO_WEBHOOK_URL")

# Telegram bot token
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
bot = Bot(token=TOKEN)
dp = Dispatcher()

# /start komandasi
@dp.message(Command(commands=["start"]))
async def start_handler(message: types.Message):
    button = KeyboardButton(text="Telefon raqamini yuborish", request_contact=True)
    markup = ReplyKeyboardMarkup(keyboard=[[button]], resize_keyboard=True, one_time_keyboard=True)
    await message.answer("Salom! Iltimos, telefon raqamingizni yuboring:", reply_markup=markup)

# Kontakt qabul qilish
@dp.message(F.content_type == "contact")
async def contact_handler(message: types.Message):
    if message.contact:
        phone_number = message.contact.phone_number
        telegram_id = message.from_user.id

        payload = {
            "telegram_id": telegram_id,
            "phone_number": phone_number
        }

        try:
            response = requests.post(DJANGO_WEBHOOK_URL, json=payload)
            if response.status_code == 200:
                await message.answer("Telefon raqamingiz saqlandi! ✅")
            else:
                await message.answer("Xatolik yuz berdi. Qayta urinib ko‘ring.")
        except Exception as e:
            await message.answer("Xatolik yuz berdi. Qayta urinib ko‘ring.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(dp.start_polling(bot))
