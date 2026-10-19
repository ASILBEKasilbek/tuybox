from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid
import re

from app.db.database import get_db
from app.models.invitation import DigitalInvitation, RSVP
from app.models.user import User
from app.schemas.invitation import (
    InvitationCreateRequest, InvitationResponse,
    RSVPCreateRequest, RSVPSummarySchema
)
from app.core.security import get_current_user

router = APIRouter(prefix="/invitations", tags=["Raqamli Taklifnoma va RSVP"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[\s\W-]+', '-', text)
    return text.strip('-')

@router.post("", response_model=InvitationResponse)
async def create_invitation(
    request: InvitationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Kelin-kuyov uchun shaxsiy to'y taklifnomasi veb-sahifasini yaratish.
    """
    base_slug = slugify(f"{request.groom_name}-{request.bride_name}")
    slug = f"{base_slug}-{uuid.uuid4().hex[:4]}"

    invite = DigitalInvitation(
        user_id=current_user.id,
        slug=slug,
        title=request.title,
        template_id=request.template_id,
        groom_name=request.groom_name,
        bride_name=request.bride_name,
        event_date=request.event_date,
        venue_name=request.venue_name,
        venue_address=request.venue_address,
        latitude=request.latitude,
        longitude=request.longitude,
        love_story_text=request.love_story_text
    )
    db.add(invite)
    await db.commit()
    await db.refresh(invite)

    return InvitationResponse(
        id=invite.id,
        slug=invite.slug,
        title=invite.title,
        groom_name=invite.groom_name,
        bride_name=invite.bride_name,
        event_date=invite.event_date,
        venue_name=invite.venue_name,
        venue_address=invite.venue_address,
        love_story_text=invite.love_story_text,
        rsvp_summary=None
    )

@router.get("/{slug}", response_model=InvitationResponse)
async def get_public_invitation(slug: str, db: AsyncSession = Depends(get_db)):
    """
    Mehmonlar ko'radigan ommaviy to'y sahifasi va RSVP xulosasi.
    """
    stmt = (
        select(DigitalInvitation)
        .options(selectinload(DigitalInvitation.rsvps))
        .where(DigitalInvitation.slug == slug)
    )
    result = await db.execute(stmt)
    invite = result.scalars().first()
    if not invite:
        raise HTTPException(status_code=404, detail="Taklifnoma sahifasi topilmadi")

    total_attending = sum(1 for r in invite.rsvps if r.attendance_status == "attending")
    total_declined = sum(1 for r in invite.rsvps if r.attendance_status == "declined")
    total_guests = sum(r.guests_count for r in invite.rsvps if r.attendance_status == "attending")

    recent = [
        RSVPCreateRequest(
            guest_name=r.guest_name,
            attendance_status=r.attendance_status,
            guests_count=r.guests_count,
            congratulation_message=r.congratulation_message
        )
        for r in invite.rsvps[-10:]
    ]

    summary = RSVPSummarySchema(
        total_attending=total_attending,
        total_declined=total_declined,
        total_guests_count=total_guests,
        recent_rsvps=recent
    )

    return InvitationResponse(
        id=invite.id,
        slug=invite.slug,
        title=invite.title,
        groom_name=invite.groom_name,
        bride_name=invite.bride_name,
        event_date=invite.event_date,
        venue_name=invite.venue_name,
        venue_address=invite.venue_address,
        love_story_text=invite.love_story_text,
        rsvp_summary=summary
    )

@router.post("/{slug}/rsvp")
async def submit_rsvp(slug: str, request: RSVPCreateRequest, db: AsyncSession = Depends(get_db)):
    """
    Mehmonning to'yga borish yoki bormasligi haqidagi javobini (RSVP) qabul qilish.
    """
    result = await db.execute(select(DigitalInvitation).where(DigitalInvitation.slug == slug))
    invite = result.scalars().first()
    if not invite:
        raise HTTPException(status_code=404, detail="Taklifnoma sahifasi topilmadi")

    rsvp = RSVP(
        invitation_id=invite.id,
        guest_name=request.guest_name,
        phone=request.phone,
        attendance_status=request.attendance_status,
        guests_count=request.guests_count if request.attendance_status == "attending" else 0,
        congratulation_message=request.congratulation_message
    )
    db.add(rsvp)
    await db.commit()

    return {
        "success": True,
        "message": f"Tashakkur, {request.guest_name}! Javobingiz qabul qilindi."
    }
