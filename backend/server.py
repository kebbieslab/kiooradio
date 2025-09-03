from fastapi import FastAPI, APIRouter, HTTPException, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, time
from enum import Enum

# New imports for document processing
import fitz  # PyMuPDF
import io
from PIL import Image
import aiohttp
import aiofiles
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create directories for document processing
TEMP_DIR = ROOT_DIR / "temp"
THUMBNAILS_DIR = ROOT_DIR / "static" / "thumbnails"
CACHE_DIR = ROOT_DIR / "cache"

# Create directories if they don't exist
for directory in [TEMP_DIR, THUMBNAILS_DIR, CACHE_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Kioo Radio API", version="1.0.0")

# Serve static files for thumbnails
from fastapi.staticfiles import StaticFiles
app.mount("/api/static", StaticFiles(directory=ROOT_DIR / "static"), name="static")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class ProgramLanguage(str, Enum):
    ENGLISH = "english"
    FRENCH = "french"
    KISSI = "kissi"
    KRIO = "krio"

class ProgramCategory(str, Enum):
    NEWS = "news"
    MUSIC = "music"
    TALK = "talk"
    RELIGIOUS = "religious"
    YOUTH = "youth"
    FARMING = "farming"
    COMMUNITY = "community"

class DayOfWeek(str, Enum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"

# Models
class Program(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    host: str
    language: ProgramLanguage
    category: ProgramCategory
    day_of_week: DayOfWeek
    start_time: str  # Format: "HH:MM"
    duration_minutes: int
    is_live: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProgramCreate(BaseModel):
    title: str
    description: str
    host: str
    language: ProgramLanguage
    category: ProgramCategory
    day_of_week: DayOfWeek
    start_time: str
    duration_minutes: int

class ImpactStory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    author_name: str
    author_location: str
    image_url: Optional[str] = None
    is_featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ImpactStoryCreate(BaseModel):
    title: str
    content: str
    author_name: str
    author_location: str
    image_url: Optional[str] = None
    is_featured: bool = False

class NewsUpdate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    excerpt: str
    author: str
    image_url: Optional[str] = None
    is_published: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class NewsUpdateCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    author: str
    image_url: Optional[str] = None
    is_published: bool = True

class Donation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    donor_name: str
    donor_email: str
    amount: float
    currency: str = "USD"
    donation_type: str  # "one-time" or "monthly"
    message: Optional[str] = None
    is_anonymous: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DonationCreate(BaseModel):
    donor_name: str
    donor_email: str
    amount: float
    currency: str = "USD"
    donation_type: str
    message: Optional[str] = None
    is_anonymous: bool = False

class StationSettings(BaseModel):
    stationWhatsAppNumber: str = "+231778383703"
    stationWhatsAppDigitsOnly: str = "231778383703" 
    stationEmail: str = "info@kiooradio.org"
    stationName: str = "Kioo Radio 98.1 FM"

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    subject: str = ""
    message: str
    partnerRef: Optional[str] = None
    pastorName: Optional[str] = None
    churchName: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: str = ""
    message: str
    partnerRef: Optional[str] = None
    pastorName: Optional[str] = None
    churchName: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

class RadioStatus(BaseModel):
    is_live: bool
    current_program: Optional[str] = None
    next_program: Optional[str] = None
    listener_count: int = 0

class MajorGiftPledge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    amount: float
    designation: str  # Solar, Studios, Programming, "Where most needed"
    pledgeDate: str
    message: Optional[str] = None
    status: str = "new"  # new, contacted, fulfilled
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MajorGiftPledgeCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    amount: float
    designation: str
    pledgeDate: str
    message: Optional[str] = None

class MediaVideo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    youtubeUrl: str
    language: str = "en"  # en/fr
    description: Optional[str] = None
    publishedAt: Optional[datetime] = None
    order: int = 1
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MediaPhoto(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    imageUrl: str
    alt: str
    caption: Optional[str] = None
    credit: Optional[str] = None
    takenAt: Optional[datetime] = None
    location: Optional[str] = None  # county/city
    language: Optional[str] = "en"  # en/fr/optional
    featured: bool = False
    order: int = 1
    consentToPublish: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MediaSettings(BaseModel):
    mediaPromoEnabled: bool = True
    videoEmbedPrivacy: str = "youtube-nocookie"
    lightbox: str = "photoswipe"
    photoPlaceholderStrategy: str = "lqip-blur"
    maxColumnsDesktop: int = 3

class MajorGiftsSettings(BaseModel):
    calUrl: Optional[str] = ""
    caseForSupportUrl: Optional[str] = ""
    impactBriefUrl: Optional[str] = ""
    budgetOverviewUrl: Optional[str] = ""
    namingOpportunities: List[str] = [
        "Studio Naming — $25,000+",
        "Transmitter Room — $15,000+", 
        "Solar Array — $35,000+",
        "Youth Programming — $10,000+",
        "Cross-Border Outreach — $20,000+"
    ]

class PaymentSettings(BaseModel):
    directLiberiaEmbedType: str = "iframe"
    directLiberiaEmbedCode: str = ""
    directLiberiaFallbackUrl: str = ""
    successRedirect: str = "/donate/thank-you"
    cancelRedirect: str = "/donate"

class AboutPageSettings(BaseModel):
    # Vision 2005 section
    visionTitle: str = "The Vision (2005)"
    visionContent: str = """In 2005, while studying at Media Village, a media school of YWMA in Cape Town, South Africa, God placed a burden on Joseph Kebbie's heart. The vision was clear: "Return to Liberia and start a radio station to reach my people." Originally, God wanted us to first start the Kissi radio station, but in His own ways, He led us to start Vox Radio first in 2017. Vox Radio began in a shipping container and has grown to serve over 3.2 million people across 8 counties in Liberia with grant support from Elmer H. Schmidt Christian Broadcasting Fund provided by Community Foundation of the North State. Now, Kioo Radio emerges as the fulfillment of God's original vision—a beacon of hope specifically for the Makona River Region, where the borders of Liberia, Sierra Leone, and Guinea meet."""
    
    # Timeline section (reordered 2024 entries)
    timelineTitle: str = "From Vision to Launch"
    timelineItems: List[dict] = [
        {"year": "2005", "event": "Vision received in Cape Town: Start a radio station in Foya, Liberia to reach Sierra Leone and Guinea"},
        {"year": "2017", "event": "Vox Radio meant to be the second station was established in a shipping container, beginning with local community programming"},
        {"year": "2024", "event": "Vox Radio expands coverage to reach 3.2M+ people across 8 counties with grant support from Elmer H. Schmidt Christian Broadcasting Fund provided by Community Foundation of the North State"},
        {"year": "2024", "event": "Daniel Hatfield challenged me to trust God to begin Kioo Radio"},
        {"year": "2025", "event": "Broadcasting license approved for Kioo Radio 98.1FM"},
        {"year": "2025", "event": "Studio construction and equipment installation begins in Foya"},
        {"year": "2025", "event": "Kioo Radio 98.1FM official launch scheduled for November 13, 2025"}
    ]
    
    # Kissi people section
    kissiTitle: str = "Who Are the Kissi? (Our Heartland)"
    kissiContent: str = """The Kissi people are a proud West African ethnic group primarily inhabiting the mountainous regions where Liberia, Sierra Leone, and Guinea converge. Known for their rich cultural heritage, agricultural expertise, and strong family values, the Kissi have maintained their traditions while adapting to modern challenges. Their language, also called Kissi, serves as a unifying force across national borders. Kioo Radio is named with deep respect for this community—"Kissi" meaning "Gift" in their native language—reflecting our mission to be a gift of God's love and truth to this region. The station serves not only the Kissi people but all communities in this tri-border area, broadcasting in multiple languages to reach every heart with the Gospel message. Originally, God's vision was to start with the Kissi radio station, but He led us to establish Vox Radio first in 2017, preparing us for this moment when Kioo Radio would fulfill His original calling."""
    
    # Document URLs
    radioProjectPptUrl: str = "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/aja36zyu_Radio%20Project11.ppt"
    maruRadioProposalPdfUrl: str = "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/r6bt039z_maru_radio_proposal.PDF"
    
    # Preview image URLs (generated dynamically)
    radioProjectPreviewImages: List[str] = []
    maruRadioProposalPreviewImages: List[str] = []

# Document processing functions
async def download_file_from_url(url: str, timeout: int = 30) -> bytes:
    """Download file from URL with proper error handling."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=timeout)) as response:
                if response.status == 200:
                    return await response.read()
                else:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Failed to download file from {url}: HTTP {response.status}"
                    )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

def generate_pdf_thumbnails(pdf_bytes: bytes, max_pages: int = 3) -> List[bytes]:
    """Generate thumbnail images from PDF pages."""
    thumbnails = []
    
    try:
        # Open PDF from bytes
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        # Set matrix for high quality output (300 DPI)
        mat = fitz.Matrix(2.0, 2.0)  # 2x scale for better quality
        
        page_count = min(len(doc), max_pages)
        
        for page_num in range(page_count):
            page = doc[page_num]
            
            # Create pixmap with high quality
            pix = page.get_pixmap(matrix=mat, alpha=False)
            
            # Convert to PIL Image for thumbnail processing
            img_data = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_data))
            
            # Create thumbnail while maintaining aspect ratio
            img.thumbnail((400, 300), Image.Resampling.LANCZOS)
            
            # Convert back to bytes
            thumbnail_bytes = io.BytesIO()
            img.save(thumbnail_bytes, format='PNG', optimize=True, quality=90)
            thumbnails.append(thumbnail_bytes.getvalue())
        
        doc.close()
        
    except Exception as e:
        print(f"Error generating PDF thumbnails: {e}")
        
    return thumbnails

async def generate_document_previews():
    """Generate preview images for both documents."""
    try:
        # Generate cache keys
        ppt_cache_key = hashlib.md5("radio_project_ppt".encode()).hexdigest()
        pdf_cache_key = hashlib.md5("maru_radio_proposal_pdf".encode()).hexdigest()
        
        preview_urls = {
            "radioProjectPreviewImages": [],
            "maruRadioProposalPreviewImages": []
        }
        
        # Process PDF document
        try:
            pdf_url = "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/r6bt039z_maru_radio_proposal.PDF"
            pdf_bytes = await download_file_from_url(pdf_url)
            pdf_thumbnails = generate_pdf_thumbnails(pdf_bytes, max_pages=3)
            
            for i, thumbnail_data in enumerate(pdf_thumbnails):
                filename = f"pdf_{pdf_cache_key}_page_{i+1}.png"
                filepath = THUMBNAILS_DIR / filename
                
                # Save thumbnail
                async with aiofiles.open(filepath, 'wb') as f:
                    await f.write(thumbnail_data)
                
                preview_urls["maruRadioProposalPreviewImages"].append(f"/api/static/thumbnails/{filename}")
                
        except Exception as e:
            print(f"Error processing PDF: {e}")
        
        # For PowerPoint, we'll create a placeholder preview for now
        # since Aspose.Slides requires a license
        try:
            # Create placeholder preview images for PowerPoint
            for i in range(3):
                placeholder_img = Image.new('RGB', (400, 300), color=(240, 240, 240))
                # Add text to placeholder
                filename = f"ppt_{ppt_cache_key}_slide_{i+1}.png"
                filepath = THUMBNAILS_DIR / filename
                
                placeholder_img.save(filepath, format='PNG', optimize=True)
                preview_urls["radioProjectPreviewImages"].append(f"/api/static/thumbnails/{filename}")
                
        except Exception as e:
            print(f"Error creating PowerPoint placeholders: {e}")
        
        return preview_urls
        
    except Exception as e:
        print(f"Error in generate_document_previews: {e}")
        return {
            "radioProjectPreviewImages": [],
            "maruRadioProposalPreviewImages": []
        }
    wire: dict = {
        "beneficiaryName": "VOX Liberia",
        "beneficiaryAddress": "C/O Galcom International, P.O. Box 1211, Foya, Lofa County, Liberia",
        "bankName": "Ecobank Liberia Limited",
        "bankAddress": "Broad Street, Monrovia, Liberia",
        "accountNumber": "2040034567890123",
        "swift": "ECOCLRLR",
        "routingNumber": "011000028",
        "intermediaryBank": "Citibank N.A. New York",
        "intermediaryAddress": "399 Park Avenue, New York, NY 10043, USA",
        "intermediarySwift": "CITIUS33",
        "intermediaryAccount": "36083522",
        "wireInstructions": "For further credit to VOX Liberia Account #2040034567890123",
        "referenceNote": "Kioo Radio 98.1 FM Major Gift",
        "contactEmail": "info@kiooradio.org",
        "contactPhone": "+231 77 838 3703"
    }

class NewsletterSignup(BaseModel):
    email: str
    adminEmail: str

class NewsletterSignupCreate(BaseModel):
    email: str
    adminEmail: str

class ChurchPartner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    pastorName: str
    churchName: str
    country: str  # Liberia, Sierra Leone, Guinea
    city: str
    altCityNames: List[str] = []
    onAirDaysTimes: Optional[str] = None
    contactPhone: Optional[str] = None
    whatsAppNumber: Optional[str] = None
    consentToDisplayContact: bool = False
    notes: Optional[str] = None
    photoUrl: Optional[str] = None
    isPublished: bool = True
    sortOrder: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChurchPartnerCreate(BaseModel):
    pastorName: str
    churchName: str
    country: str
    city: str
    altCityNames: List[str] = []
    onAirDaysTimes: Optional[str] = None
    contactPhone: Optional[str] = None
    whatsAppNumber: Optional[str] = None
    consentToDisplayContact: bool = False
    notes: Optional[str] = None
    photoUrl: Optional[str] = None
    isPublished: bool = True
    sortOrder: Optional[int] = None

# Routes
@api_router.get("/")
async def root():
    return {"message": "Kioo Radio API - The Gift of Good News", "version": "1.0.0"}

@api_router.get("/radio/status", response_model=RadioStatus)
async def get_radio_status():
    # Placeholder for now - in real implementation, this would check actual streaming status
    return RadioStatus(
        is_live=True,
        current_program="Good Morning Kioo",
        next_program="Community Voice",
        listener_count=247
    )

# Programs endpoints
@api_router.post("/programs", response_model=Program)
async def create_program(program: ProgramCreate):
    program_dict = program.dict()
    program_obj = Program(**program_dict)
    await db.programs.insert_one(program_obj.dict())
    return program_obj

@api_router.get("/programs", response_model=List[Program])
async def get_programs(language: Optional[ProgramLanguage] = None, day: Optional[DayOfWeek] = None):
    filter_dict = {}
    if language:
        filter_dict["language"] = language
    if day:
        filter_dict["day_of_week"] = day
    
    programs = await db.programs.find(filter_dict).sort("start_time", 1).to_list(1000)
    return [Program(**program) for program in programs]

@api_router.get("/programs/schedule")
async def get_schedule():
    programs = await db.programs.find().sort([("day_of_week", 1), ("start_time", 1)]).to_list(1000)
    
    # Group by day of week
    schedule = {}
    for program in programs:
        day = program["day_of_week"]
        if day not in schedule:
            schedule[day] = []
        schedule[day].append(Program(**program))
    
    return schedule

# Impact Stories endpoints
@api_router.post("/impact-stories", response_model=ImpactStory)
async def create_impact_story(story: ImpactStoryCreate):
    story_dict = story.dict()
    story_obj = ImpactStory(**story_dict)
    await db.impact_stories.insert_one(story_obj.dict())
    return story_obj

@api_router.get("/impact-stories", response_model=List[ImpactStory])
async def get_impact_stories(featured_only: bool = False):
    filter_dict = {}
    if featured_only:
        filter_dict["is_featured"] = True
    
    stories = await db.impact_stories.find(filter_dict).sort("created_at", -1).to_list(1000)
    return [ImpactStory(**story) for story in stories]

# News endpoints
@api_router.post("/news", response_model=NewsUpdate)
async def create_news_update(news: NewsUpdateCreate):
    news_dict = news.dict()
    news_obj = NewsUpdate(**news_dict)
    await db.news_updates.insert_one(news_obj.dict())
    return news_obj

@api_router.get("/news", response_model=List[NewsUpdate])
async def get_news_updates(published_only: bool = True):
    filter_dict = {}
    if published_only:
        filter_dict["is_published"] = True
    
    news = await db.news_updates.find(filter_dict).sort("created_at", -1).to_list(1000)
    return [NewsUpdate(**news_item) for news_item in news]

# Donations endpoints
@api_router.post("/donations", response_model=Donation)
async def create_donation(donation: DonationCreate):
    donation_dict = donation.dict()
    donation_obj = Donation(**donation_dict)
    await db.donations.insert_one(donation_obj.dict())
    return donation_obj

@api_router.get("/donations/total")
async def get_donation_total():
    pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$amount"}, "count": {"$sum": 1}}}
    ]
    result = await db.donations.aggregate(pipeline).to_list(1)
    if result:
        return {"total_amount": result[0]["total"], "donor_count": result[0]["count"]}
    return {"total_amount": 0, "donor_count": 0}

# Contact endpoints
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message: ContactMessageCreate):
    message_dict = message.dict()
    message_obj = ContactMessage(**message_dict)
    await db.contact_messages.insert_one(message_obj.dict())
    return message_obj

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find().sort("created_at", -1).to_list(1000)
    return [ContactMessage(**message) for message in messages]

# Major Gifts endpoints
@api_router.get("/major-gifts-settings")
async def get_major_gifts_settings():
    """Get major gifts settings for calendar, documents, etc."""
    # In real implementation, this would come from database
    settings = MajorGiftsSettings()
    return settings

@api_router.put("/major-gifts-settings")
async def update_major_gifts_settings(settings: MajorGiftsSettings):
    """Update major gifts settings (admin only in real app)"""
    # In real implementation, this would update the database
    return {"message": "Major gifts settings updated successfully", "settings": settings}

@api_router.get("/payment-settings")
async def get_payment_settings():
    """Get payment settings for Direct Liberia, wire transfers, etc."""
    # In real implementation, this would come from database
    settings = PaymentSettings()
    return settings

@api_router.put("/payment-settings") 
async def update_payment_settings(settings: PaymentSettings):
    """Update payment settings (admin only in real app)"""
    # In real implementation, this would update the database
    return {"message": "Payment settings updated successfully", "settings": settings}

@api_router.post("/pledges")
async def create_pledge(pledge: MajorGiftPledgeCreate):
    """Create a new major gift pledge"""
    try:
        # Create pledge document
        pledge_doc = MajorGiftPledge(**pledge.model_dump())
        
        # Insert into database
        result = await db.major_gift_pledges.insert_one(pledge_doc.model_dump())
        
        # Send email notification (in real app, this would send actual email)
        print(f"New major gift pledge received: {pledge.name} - ${pledge.amount}")
        
        return {
            "message": "Pledge created successfully",
            "pledgeId": pledge_doc.id,
            "status": "success"
        }
    except Exception as e:
        print(f"Error creating pledge: {e}")
        raise HTTPException(status_code=500, detail="Failed to create pledge")

@api_router.get("/pledges")
async def get_pledges():
    """Get all major gift pledges (admin only)"""
    try:
        pledges = await db.major_gift_pledges.find().to_list(1000)
        return pledges
    except Exception as e:
        print(f"Error fetching pledges: {e}")
        return []

# Station Settings endpoints (updated)
@api_router.get("/station-settings")
async def get_station_settings():
    """Get station settings for WhatsApp number, email, etc."""
    # In a real implementation, this would come from database
    # For now, return static settings
    settings = StationSettings()
    return settings

@api_router.put("/station-settings")
async def update_station_settings(settings: StationSettings):
    """Update station settings (admin only in real app)"""
    # In a real implementation, this would update the database
    # For now, just return the submitted settings
    return {"message": "Station settings updated successfully", "settings": settings}

# Newsletter signup endpoint
@api_router.post("/newsletter-signup")
async def newsletter_signup(signup: NewsletterSignupCreate):
    # Store the newsletter signup in database
    signup_record = {
        "email": signup.email,
        "admin_email": signup.adminEmail,
        "subscribed_at": datetime.utcnow(),
        "id": str(uuid.uuid4())
    }
    await db.newsletter_signups.insert_one(signup_record)
    
    # In a real implementation, you would send an email to admin@proudlyliberian.com
    # For now, we'll just store the subscription
    
    return {"message": "Successfully subscribed to newsletter", "email": signup.email}

# Church Partners endpoints
@api_router.get("/church-partners")
async def get_church_partners(country: Optional[str] = None, city: Optional[str] = None, published_only: bool = True):
    try:
        # Test database connection
        total_count = await db.church_partners.count_documents({})
        print(f"Total partners in DB: {total_count}")
        
        query = {}
        if country:
            query["country"] = country
        if city:
            query["city"] = city
        if published_only:
            query["isPublished"] = True
        
        print(f"Query: {query}")  # Debug
        
        partners = await db.church_partners.find(query).to_list(1000)
        print(f"Found {len(partners)} partners")  # Debug
        
        # Sort by sortOrder if provided, then by pastorName
        def sort_key(partner):
            sort_order = partner.get("sortOrder")
            if sort_order is None:
                sort_order = 9999
            return (sort_order, partner.get("pastorName", ""))
        
        partners.sort(key=sort_key)
        
        # Convert MongoDB documents to proper format
        result = []
        for partner in partners:
            # Convert MongoDB _id to string and remove it
            if '_id' in partner:
                del partner['_id']
            # Convert datetime to string if present
            if 'created_at' in partner:
                partner['created_at'] = partner['created_at'].isoformat()
            result.append(partner)
        
        return result
    except Exception as e:
        print(f"Error in get_church_partners: {e}")
        return []

@api_router.post("/church-partners", response_model=ChurchPartner)
async def create_church_partner(partner: ChurchPartnerCreate):
    partner_dict = partner.dict()
    partner_obj = ChurchPartner(**partner_dict)
    await db.church_partners.insert_one(partner_obj.dict())
    return partner_obj

@api_router.get("/church-partners/{partner_id}", response_model=ChurchPartner)
async def get_church_partner(partner_id: str):
    partner = await db.church_partners.find_one({"id": partner_id})
    if not partner:
        raise HTTPException(status_code=404, detail="Church partner not found")
    return ChurchPartner(**partner)

@api_router.put("/church-partners/{partner_id}", response_model=ChurchPartner)
async def update_church_partner(partner_id: str, partner: ChurchPartnerCreate):
    partner_dict = partner.dict()
    partner_dict["id"] = partner_id
    
    result = await db.church_partners.replace_one(
        {"id": partner_id}, 
        partner_dict
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Church partner not found")
    
    return ChurchPartner(**partner_dict)

@api_router.delete("/church-partners/{partner_id}")
async def delete_church_partner(partner_id: str):
    result = await db.church_partners.delete_one({"id": partner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Church partner not found")
    return {"message": "Church partner deleted successfully"}

# About Page Settings endpoints
@api_router.get("/about-page-settings")
async def get_about_page_settings():
    """Get About page settings for vision story, timeline, and documents with preview images"""
    try:
        # Get base settings
        settings = AboutPageSettings()
        
        # Generate document previews
        preview_urls = await generate_document_previews()
        
        # Update settings with preview images
        settings.radioProjectPreviewImages = preview_urls["radioProjectPreviewImages"]
        settings.maruRadioProposalPreviewImages = preview_urls["maruRadioProposalPreviewImages"]
        
        return settings
    except Exception as e:
        print(f"Error fetching about page settings: {e}")
        # Return settings without previews if there's an error
        settings = AboutPageSettings()
        return settings

@api_router.put("/about-page-settings")
async def update_about_page_settings(settings: AboutPageSettings):
    """Update About page settings (admin only in real app)"""
    try:
        # In a real implementation, this would update the database
        # For now, just return the submitted settings
        return {"message": "About page settings updated successfully", "settings": settings}
    except Exception as e:
        print(f"Error updating about page settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to update about page settings")

# Media endpoints
@api_router.get("/media/videos")
async def get_media_videos():
    """Get all media videos ordered by order field"""
    try:
        # Return default videos for now - in real implementation would come from database
        default_videos = [
            {
                "id": "video-1",
                "title": "From Calling to Airwaves: The Vision Behind Kioo Radio 98.1FM",
                "youtubeUrl": "https://youtu.be/qdYg94D1hn0",
                "language": "en",
                "description": "The inspiring story of God's calling to establish Kioo Radio",
                "order": 1,
                "featured": True
            },
            {
                "id": "video-2", 
                "title": "De l'appel aux ondes : la vision à l'origine de Kioo Radio 98.1FM (French Version)",
                "youtubeUrl": "https://youtu.be/4DaV2C2M074",
                "language": "fr",
                "description": "L'histoire inspirante de l'appel de Dieu à établir Kioo Radio",
                "order": 2,
                "featured": True
            },
            {
                "id": "video-3",
                "title": "From Capitol to Betche Hill, Foya: President Joseph N. Boakai, Sr. Supports Kioo Radio", 
                "youtubeUrl": "https://youtu.be/KmH0jOBGEe8",
                "language": "en",
                "description": "Presidential support for Kioo Radio's mission in Liberia",
                "order": 3,
                "featured": True
            },
            {
                "id": "video-4",
                "title": "Foya City Mayor Hon. Josiah Saahkeh endorses Kioo Radio",
                "youtubeUrl": "https://youtu.be/1flOExdkaDU",
                "language": "en", 
                "description": "Local government support from Foya City Mayor for Kioo Radio",
                "order": 4,
                "featured": True
            }
        ]
        return default_videos
    except Exception as e:
        print(f"Error fetching media videos: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch media videos")

@api_router.get("/media/photos")
async def get_media_photos():
    """Get all media photos ordered by order field"""
    try:
        # Updated with real photos from user uploads
        default_photos = [
            {
                "id": "photo-1",
                "title": "Kioo Radio Studio Construction",
                "imageUrl": "/assets/images/gallery/studio-construction.jpg",
                "alt": "Construction of Kioo Radio studio in Foya",
                "caption": "Building the future of Christian broadcasting in the Makona River Region",
                "location": "Foya, Lofa County, Liberia",
                "featured": True,
                "order": 1
            },
            {
                "id": "photo-2",
                "title": "Community Gathering",
                "imageUrl": "/assets/images/gallery/community-gathering.jpg", 
                "alt": "Community members gathered for radio station blessing",
                "caption": "Local church leaders and community members pray for Kioo Radio",
                "location": "Betche Hill, Foya",
                "featured": True,
                "order": 2
            },
            {
                "id": "photo-3",
                "title": "Broadcasting Equipment",
                "imageUrl": "/assets/images/gallery/broadcasting-equipment.jpg",
                "alt": "Professional radio broadcasting equipment",
                "caption": "State-of-the-art equipment ready to serve the tri-border region",
                "location": "Kioo Radio Studio",
                "featured": True,
                "order": 3
            },
            {
                "id": "photo-4",
                "title": "Radio Tower",
                "imageUrl": "/assets/images/gallery/radio-tower.jpg",
                "alt": "Kioo Radio transmission tower",
                "caption": "The tower that will broadcast hope across the Makona River Region",
                "location": "Foya, Lofa County, Liberia",
                "featured": False,
                "order": 4
            }
        ]
        return default_photos
    except Exception as e:
        print(f"Error fetching media photos: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch media photos")

@api_router.get("/media/settings")
async def get_media_settings():
    """Get media settings for display configuration"""
    try:
        settings = MediaSettings()
        return settings
    except Exception as e:
        print(f"Error fetching media settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch media settings")

@api_router.put("/media/settings")
async def update_media_settings(settings: MediaSettings):
    """Update media settings (admin only in real app)"""
    try:
        # In real implementation, this would update the database
        return {"message": "Media settings updated successfully", "settings": settings}
    except Exception as e:
        print(f"Error updating media settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to update media settings")

class LiveBroadcastSchedule(BaseModel):
    country: str
    liveDays: List[str]
    preRecordedDays: List[str]
    specialNote: str
    colorCode: str

# Live Broadcast Schedule endpoints
@api_router.get("/live-broadcast-schedule")
async def get_live_broadcast_schedule():
    """Get live broadcast schedule based on Weekly_Live_vs_Pre-Recorded_Rotation"""
    try:
        # Weekly schedule data
        weekly_schedule = {
            "monday": {"liberia": "live", "sierra_leone": "pre-recorded", "guinea": "pre-recorded"},
            "tuesday": {"liberia": "live", "sierra_leone": "live", "guinea": "pre-recorded"},
            "wednesday": {"liberia": "live", "sierra_leone": "pre-recorded", "guinea": "live"},
            "thursday": {"liberia": "live", "sierra_leone": "pre-recorded", "guinea": "pre-recorded"},
            "friday": {"liberia": "live", "sierra_leone": "live", "guinea": "pre-recorded"},
            "saturday": {"liberia": "live", "sierra_leone": "pre-recorded", "guinea": "live"},
            "sunday": {"liberia": "live", "sierra_leone": "rotation", "guinea": "rotation", "note": "Sunday service rotates weekly between all three countries"}
        }
        
        # Country summary data
        country_schedules = [
            {
                "country": "Liberia",
                "liveDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "preRecordedDays": [],
                "specialNote": "Always anchor & daily presence",
                "colorCode": "green"
            },
            {
                "country": "Sierra Leone", 
                "liveDays": ["Tuesday", "Friday"],
                "preRecordedDays": ["Monday", "Wednesday", "Thursday", "Saturday"],
                "specialNote": "Sunday live if in rotation",
                "colorCode": "blue"
            },
            {
                "country": "Guinea",
                "liveDays": ["Wednesday", "Saturday"], 
                "preRecordedDays": ["Monday", "Tuesday", "Thursday", "Friday"],
                "specialNote": "Sunday live if in rotation",
                "colorCode": "gold"
            }
        ]
        
        return {
            "weeklySchedule": weekly_schedule,
            "countrySchedules": country_schedules,
            "introText": "Because of cross-border travel distances, not every team can be live in Foya every day. To ensure fairness and inclusion, each country has specific live days, while pre-recorded programs fill the gaps. Here is our official weekly live broadcast rotation."
        }
    except Exception as e:
        print(f"Error fetching live broadcast schedule: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch live broadcast schedule")

class TestimonyLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    name: Optional[str] = None
    location: str
    program: str
    summary: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CallLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    time: str
    phone: Optional[str] = None
    summary: str
    category: str  # Testimony, Question, Complaint, Prayer Request
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Dashboard endpoints
@api_router.get("/dashboard/weather")
async def get_dashboard_weather():
    """Get weather data for broadcast areas using Open-Meteo API"""
    try:
        import aiohttp
        
        # City coordinates
        cities = {
            "Foya, Liberia": {"lat": 8.3580, "lon": -10.2049},
            "Koindu, Sierra Leone": {"lat": 8.2804, "lon": -10.6514},
            "Guéckédou, Guinea": {"lat": 8.5674, "lon": -10.1330},
            "Kissidougou, Guinea": {"lat": 9.1885, "lon": -10.0996}
        }
        
        weather_data = {}
        
        async with aiohttp.ClientSession() as session:
            for city_name, coords in cities.items():
                try:
                    # Open-Meteo API call
                    url = f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}&current_weather=true&timezone=GMT"
                    
                    async with session.get(url, timeout=10) as response:
                        if response.status == 200:
                            data = await response.json()
                            current = data.get("current_weather", {})
                            
                            # Map weather codes to conditions (WMO Weather interpretation codes)
                            weather_code = current.get("weathercode", 0)
                            condition_map = {
                                0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
                                45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
                                55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
                                61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain", 66: "Light freezing rain",
                                67: "Heavy freezing rain", 71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
                                77: "Snow grains", 80: "Slight rain showers", 81: "Moderate rain showers",
                                82: "Violent rain showers", 85: "Slight snow showers", 86: "Heavy snow showers",
                                95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail"
                            }
                            
                            condition = condition_map.get(weather_code, "Unknown")
                            temperature = round(current.get("temperature", 0))
                            
                            weather_data[city_name] = {
                                "temperature": temperature,
                                "condition": condition,
                                "updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
                            }
                        else:
                            # Fallback data if API fails
                            weather_data[city_name] = {
                                "temperature": "N/A",
                                "condition": "Weather unavailable",
                                "updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
                            }
                except Exception as city_error:
                    print(f"Error fetching weather for {city_name}: {city_error}")
                    # Fallback data for this city
                    weather_data[city_name] = {
                        "temperature": "N/A",
                        "condition": "Weather unavailable",
                        "updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
                    }
        
        return weather_data
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        # Return fallback data for all cities
        fallback_data = {}
        cities = ["Foya, Liberia", "Koindu, Sierra Leone", "Guéckédou, Guinea", "Kissidougou, Guinea"]
        for city in cities:
            fallback_data[city] = {
                "temperature": "N/A",
                "condition": "Weather unavailable", 
                "updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
            }
        return fallback_data

@api_router.get("/dashboard/schedule")
async def get_dashboard_schedule():
    """Get weekly program schedule"""
    try:
        # Mock schedule data
        schedule_data = [
            {"day": "Monday", "time": "06:00", "program": "Morning Devotion", "presenter": "Rev. Samuel"},
            {"day": "Monday", "time": "08:00", "program": "Kissi News", "presenter": "Marie Camara"},
            {"day": "Monday", "time": "10:00", "program": "Community Talk", "presenter": "Emmanuel Koroma"},
            {"day": "Tuesday", "time": "06:00", "program": "Morning Devotion", "presenter": "Rev. Samuel"},
            {"day": "Tuesday", "time": "08:00", "program": "French Gospel Hour", "presenter": "Pasteur Jean"},
            {"day": "Tuesday", "time": "10:00", "program": "Health Education", "presenter": "Dr. Fatima"},
            {"day": "Wednesday", "time": "06:00", "program": "Morning Devotion", "presenter": "Rev. Samuel"},
            {"day": "Wednesday", "time": "08:00", "program": "Guinea Connection", "presenter": "Amadou Diallo"},
            {"day": "Wednesday", "time": "10:00", "program": "Bible Study", "presenter": "Pastor John"},
            {"day": "Thursday", "time": "06:00", "program": "Morning Devotion", "presenter": "Rev. Samuel"},
            {"day": "Thursday", "time": "08:00", "program": "Community Forum", "presenter": "Sarah Williams"},
            {"day": "Thursday", "time": "10:00", "program": "Music & Praise", "presenter": "Choir Leader"},
            {"day": "Friday", "time": "06:00", "program": "Morning Devotion", "presenter": "Rev. Samuel"},
            {"day": "Friday", "time": "08:00", "program": "Sierra Leone Hour", "presenter": "Moses Kargbo"},
            {"day": "Friday", "time": "10:00", "program": "Youth Forum", "presenter": "David Kolleh"},
            {"day": "Saturday", "time": "08:00", "program": "Family Time", "presenter": "Mrs. Johnson"},
            {"day": "Saturday", "time": "10:00", "program": "Traditional Music", "presenter": "Cultural Team"},
            {"day": "Sunday", "time": "08:00", "program": "Sunday Service", "presenter": "Various Pastors"},
            {"day": "Sunday", "time": "14:00", "program": "Gospel Hour", "presenter": "Rev. Samuel"}
        ]
        return schedule_data
    except Exception as e:
        print(f"Error fetching schedule: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch schedule")

@api_router.get("/dashboard/presenters")
async def get_dashboard_presenters():
    """Get presenters by country"""
    try:
        presenters_data = {
            "liberia": [
                {
                    "name": "Rev. Samuel Johnson",
                    "programs": ["Morning Devotion", "Gospel Hour"],
                    "schedule": "Daily 6:00 AM, Sunday 2:00 PM"
                },
                {
                    "name": "Sarah Williams",
                    "programs": ["Community Forum", "Women's Hour"],
                    "schedule": "Thursday 8:00 AM, Friday 3:00 PM"
                },
                {
                    "name": "David Kolleh",
                    "programs": ["Youth Forum", "Sports Talk"],
                    "schedule": "Friday 10:00 AM, Saturday 4:00 PM"
                }
            ],
            "sierra_leone": [
                {
                    "name": "Emmanuel Koroma",
                    "programs": ["Community Talk", "Technical Hour"],
                    "schedule": "Monday 10:00 AM, Wednesday 3:00 PM"
                },
                {
                    "name": "Moses Kargbo",
                    "programs": ["Sierra Leone Hour", "Cultural Show"],
                    "schedule": "Friday 8:00 AM, Saturday 1:00 PM"
                },
                {
                    "name": "Rev. Philip Tamba Kamara",
                    "programs": ["Sunday Service", "Bible Study"],
                    "schedule": "Sunday 8:00 AM (rotation), Tuesday 7:00 PM"
                }
            ],
            "guinea": [
                {
                    "name": "Marie Camara",
                    "programs": ["Kissi News", "Community Outreach"],
                    "schedule": "Monday 8:00 AM, Thursday 2:00 PM"
                },
                {
                    "name": "Amadou Diallo",
                    "programs": ["Guinea Connection", "French Hour"],
                    "schedule": "Wednesday 8:00 AM, Saturday 10:00 AM"
                },
                {
                    "name": "Pasteur Jean",
                    "programs": ["French Gospel Hour", "Prayer Meeting"],
                    "schedule": "Tuesday 8:00 AM, Thursday 6:00 PM"
                }
            ]
        }
        return presenters_data
    except Exception as e:
        print(f"Error fetching presenters: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch presenters")

@api_router.post("/dashboard/testimony")
async def submit_testimony(testimony: TestimonyLog):
    """Submit a testimony log"""
    try:
        # In production, save to database
        # For now, just return success
        return {"message": "Testimony logged successfully", "id": testimony.id}
    except Exception as e:
        print(f"Error submitting testimony: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit testimony")

@api_router.post("/dashboard/call-log")
async def submit_call_log(call: CallLog):
    """Submit a call log"""
    try:
        # In production, save to database
        # For now, just return success
        return {"message": "Call logged successfully", "id": call.id}
    except Exception as e:
        print(f"Error submitting call log: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit call log")

@api_router.get("/dashboard/export")
async def export_dashboard_data():
    """Export all dashboard data as CSV"""
    try:
        # Mock export data - in production, fetch from database
        csv_content = """Type,Date,Time,Location,Program,Name,Phone,Category,Summary
Testimony,2024-09-01,,Foya,Morning Devotion,John Doe,,,"God healed my family"
Call,2024-09-01,08:30,,Community Forum,,+231-77-123456,Prayer Request,"Please pray for my sick mother"
Testimony,2024-09-02,,Koindu,French Hour,Marie,,,"Testimony about answered prayer"
Call,2024-09-02,14:15,,Bible Study,,+232-88-987654,Question,"Question about baptism"
"""
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=kioo-radio-dashboard.csv"}
        )
    except Exception as e:
        print(f"Error exporting data: {e}")
        raise HTTPException(status_code=500, detail="Failed to export data")

# Coverage areas endpoint
@api_router.get("/coverage")
async def get_coverage_areas():
    return {
        "countries": [
            {"name": "Liberia", "coverage": 85, "major_cities": ["Monrovia", "Gbarnga", "Buchanan"]},
            {"name": "Sierra Leone", "coverage": 70, "major_cities": ["Freetown", "Bo", "Kenema"]},
            {"name": "Guinea", "coverage": 60, "major_cities": ["Conakry", "Kankan", "Labé"]}
        ],
        "total_reach": "Over 2 million people",
        "signal_strength": "Strong FM signal covering 150+ mile radius"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()