from fastapi import FastAPI, APIRouter, HTTPException
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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Kioo Radio API", version="1.0.0")

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
    visionContent: str = """In 2005, while studying at Cape Peninsula University of Technology in Cape Town, South Africa, God placed a burden on Joseph Kebbie's heart. The vision was clear: "Return to Liberia and start a radio station to reach my people." This divine calling began with Vox Radio, which has grown to serve over 3.2 million people across 8 counties in Liberia. Now, Kioo Radio emerges as the fulfillment of this expanded vision—a beacon of hope specifically for the Makona River Region, where the borders of Liberia, Sierra Leone, and Guinea meet."""
    
    # Timeline section
    timelineTitle: str = "From Vision to Launch"
    timelineItems: List[dict] = [
        {"year": "2005", "event": "Vision received in Cape Town: Start a radio station in Liberia"},
        {"year": "2006", "event": "Vox Radio established, beginning with local community programming"},
        {"year": "2010-2020", "event": "Vox Radio expands to reach 3.2M+ people across 8 counties"},
        {"year": "2023", "event": "Burden grows for the Makona River Region - tri-border communities"},
        {"year": "2024", "event": "Broadcasting license approved for Kioo Radio extension"},
        {"year": "2024", "event": "Studio construction and equipment installation begins in Foya"},
        {"year": "2025", "event": "Official launch scheduled for November 13, 2025"}
    ]
    
    # Kissi people section
    kissiTitle: str = "Who Are the Kissi? (Our Heartland)"
    kissiContent: str = """The Kissi people are a proud West African ethnic group primarily inhabiting the mountainous regions where Liberia, Sierra Leone, and Guinea converge. Known for their rich cultural heritage, agricultural expertise, and strong family values, the Kissi have maintained their traditions while adapting to modern challenges. Their language, also called Kissi, serves as a unifying force across national borders. Kioo Radio is named with deep respect for this community—"Kioo" meaning "mirror" in Kissi—reflecting our mission to be a clear reflection of God's love and truth to this region. The station serves not only the Kissi people but all communities in this tri-border area, broadcasting in multiple languages to reach every heart with the Gospel message."""
    
    # Document URLs
    radioProjectPptUrl: str = "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/aja36zyu_Radio%20Project11.ppt"
    maruRadioProposalPdfUrl: str = "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/r6bt039z_maru_radio_proposal.PDF"
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