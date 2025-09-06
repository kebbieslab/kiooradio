# 📖 Kioo Radio Backend Editing Manual

## 🏗️ System Architecture

```
Kioo Radio Website Structure:
├── /app/backend/
│   ├── server.py              # Main API server (FastAPI)
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── /app/frontend/             # React frontend
└── /app/populate_sample_data.py # Sample data script
```

## 📊 Database Collections

The MongoDB database contains these collections:
- `programs` - Radio program schedule
- `impact_stories` - Listener testimonials
- `news_updates` - Latest news and updates
- `donations` - Donation records
- `contact_messages` - Contact form submissions

## 🛠️ How to Edit Content

### 1. Adding New Radio Programs

**Option A: Via API (Recommended)**
```bash
curl -X POST "https://kioo-radio-crm.preview.emergentagent.com/api/programs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Evening Devotions",
    "description": "Peaceful evening prayers and reflections",
    "host": "Pastor John Doe",
    "language": "english",
    "category": "religious",
    "day_of_week": "sunday",
    "start_time": "18:00",
    "duration_minutes": 60
  }'
```

**Option B: Direct Database Edit**
```python
# Connect to MongoDB and add program
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import uuid
from datetime import datetime

async def add_program():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["test_database"]
    
    new_program = {
        "id": str(uuid.uuid4()),
        "title": "Evening Devotions",
        "description": "Peaceful evening prayers and reflections",
        "host": "Pastor John Doe",
        "language": "english",
        "category": "religious", 
        "day_of_week": "sunday",
        "start_time": "18:00",
        "duration_minutes": 60,
        "is_live": False,
        "created_at": datetime.utcnow()
    }
    
    await db.programs.insert_one(new_program)
    print("Program added successfully!")

# Run: asyncio.run(add_program())
```

### 2. Adding Impact Stories

```bash
curl -X POST "https://kioo-radio-crm.preview.emergentagent.com/api/impact-stories" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Radio Changed My Life",
    "content": "Your story content here...",
    "author_name": "Mary Johnson",
    "author_location": "Monrovia, Liberia",
    "is_featured": true
  }'
```

### 3. Adding News Updates

```bash
curl -X POST "https://kioo-radio-crm.preview.emergentagent.com/api/news" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Studio Expansion Complete", 
    "content": "Full article content...",
    "excerpt": "Brief summary...",
    "author": "Station Manager",
    "is_published": true
  }'
```

### 4. Managing Donations

View donation totals:
```bash
curl "https://kioo-radio-crm.preview.emergentagent.com/api/donations/total"
```

Add new donation record:
```bash
curl -X POST "https://kioo-radio-crm.preview.emergentagent.com/api/donations" \
  -H "Content-Type: application/json" \
  -d '{
    "donor_name": "John Smith",
    "donor_email": "john@example.com", 
    "amount": 100.0,
    "currency": "USD",
    "donation_type": "one-time",
    "message": "Keep up the great work!",
    "is_anonymous": false
  }'
```

## 🔧 Modifying API Endpoints

### Location: `/app/backend/server.py`

#### Adding New Endpoint
```python
# Add this to server.py

@api_router.get("/custom-endpoint")
async def my_custom_endpoint():
    return {"message": "Custom data here"}

# For database operations
@api_router.get("/custom-data", response_model=List[CustomModel])
async def get_custom_data():
    data = await db.custom_collection.find().to_list(1000)
    return [CustomModel(**item) for item in data]
```

#### Modifying Existing Endpoints
```python
# Find the endpoint in server.py and modify
@api_router.get("/programs")
async def get_programs(
    language: Optional[ProgramLanguage] = None, 
    day: Optional[DayOfWeek] = None,
    # Add new parameter
    category: Optional[ProgramCategory] = None
):
    filter_dict = {}
    if language:
        filter_dict["language"] = language
    if day:
        filter_dict["day_of_week"] = day
    # Add new filter
    if category:
        filter_dict["category"] = category
    
    programs = await db.programs.find(filter_dict).sort("start_time", 1).to_list(1000)
    return [Program(**program) for program in programs]
```

## 📝 Adding New Data Models

```python
# Add new model to server.py
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    author: str
    location: str
    program_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    content: str
    author: str 
    location: str
    program_name: Optional[str] = None

# Add corresponding endpoints
@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    testimonial_dict = testimonial.dict()
    testimonial_obj = Testimonial(**testimonial_dict)
    await db.testimonials.insert_one(testimonial_obj.dict())
    return testimonial_obj

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find().sort("created_at", -1).to_list(1000)
    return [Testimonial(**testimonial) for testimonial in testimonials]
```

## 💾 Database Management

### Direct MongoDB Access
```bash
# Connect to MongoDB shell
mongo mongodb://localhost:27017/test_database

# View collections
show collections

# View programs
db.programs.find().pretty()

# Update a program
db.programs.updateOne(
    {"title": "Good Morning Kioo"},
    {"$set": {"duration_minutes": 120}}
)

# Delete old records
db.contact_messages.deleteMany({"created_at": {"$lt": new Date("2024-01-01")}})
```

### Backup Database
```bash
# Create backup
mongodump --host localhost:27017 --db test_database --out /app/backups/

# Restore backup  
mongorestore --host localhost:27017 --db test_database /app/backups/test_database/
```

## 🔄 Restarting Services

After making changes, restart the backend:
```bash
sudo supervisorctl restart backend
```

Check service status:
```bash
sudo supervisorctl status
```

View logs:
```bash
tail -f /var/log/supervisor/backend.*.log
```

## 📊 Data Validation Rules

### Program Data Rules:
- `language`: Must be one of: english, french, kissi, krio  
- `category`: Must be one of: news, music, talk, religious, youth, farming, community
- `day_of_week`: Must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday
- `start_time`: Format "HH:MM" (24-hour)
- `duration_minutes`: Integer (typically 30, 60, 90, 120, 180)

### Donation Rules:
- `amount`: Must be positive number
- `currency`: Typically "USD" 
- `donation_type`: "one-time" or "monthly"
- `donor_email`: Must be valid email format

## 🛡️ Environment Variables

Location: `/app/backend/.env`

```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"  
CORS_ORIGINS="*"
```

**⚠️ IMPORTANT**: Never modify URLs in `.env` files as they are configured for the deployment environment.

## 🧪 Testing Changes

### Test API Endpoint
```bash
# Test if endpoint works
curl "https://kioo-radio-crm.preview.emergentagent.com/api/your-new-endpoint"

# Test with data
curl -X POST "https://kioo-radio-crm.preview.emergentagent.com/api/your-endpoint" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Run Test Suite
```bash
cd /app && python backend_test.py
```

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check logs
tail -n 50 /var/log/supervisor/backend.err.log

# Common issues:
# 1. Syntax error in server.py
# 2. Missing Python dependencies  
# 3. MongoDB connection issues

# Fix dependencies
cd /app/backend && pip install -r requirements.txt

# Restart
sudo supervisorctl restart backend
```

### Database Connection Issues
```bash
# Check MongoDB status
sudo supervisorctl status mongodb

# Restart MongoDB
sudo supervisorctl restart mongodb

# Test connection
mongo mongodb://localhost:27017
```

### API Not Responding
```bash
# Check if backend is running
curl "https://kioo-radio-crm.preview.emergentagent.com/api/"

# Should return: {"message":"Kioo Radio API - The Gift of Good News","version":"1.0.0"}
```

## 📈 Monitoring & Maintenance

### View Current Data
```bash
# Count records in each collection
mongo mongodb://localhost:27017/test_database --eval "
  db.programs.count();
  db.impact_stories.count();
  db.news_updates.count();
  db.donations.count();
"
```

### Regular Maintenance Tasks

1. **Weekly**: Check logs for errors
2. **Monthly**: Backup database
3. **Quarterly**: Update dependencies (carefully test first)
4. **As needed**: Add new programs, update content

### Performance Monitoring
```bash
# Check API response times
curl -w "@/dev/stdin" "https://kioo-radio-crm.preview.emergentagent.com/api/" <<< "
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n  
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
"
```

## 🚀 Adding New Features

### Example: Adding Event Management

1. **Add Model** (in server.py):
```python
class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_date: datetime
    location: str
    is_featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EventCreate(BaseModel):
    title: str
    description: str
    event_date: datetime
    location: str
    is_featured: bool = False
```

2. **Add Endpoints**:
```python
@api_router.post("/events", response_model=Event)
async def create_event(event: EventCreate):
    event_dict = event.dict()
    event_obj = Event(**event_dict)
    await db.events.insert_one(event_obj.dict())
    return event_obj

@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find().sort("event_date", 1).to_list(1000)
    return [Event(**event) for event in events]
```

3. **Test New Feature**:
```bash
curl -X POST "https://kioo-radio-crm.preview.emergentagent.com/api/events" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Community Outreach",
    "description": "Join us for community service",
    "event_date": "2025-12-01T10:00:00",
    "location": "Monrovia Community Center",
    "is_featured": true
  }'
```

4. **Restart Services**:
```bash
sudo supervisorctl restart backend
```

## 📞 Support & Resources

- **Backend Server**: FastAPI with automatic docs at `/docs`
- **Database**: MongoDB with Motor async driver
- **API Testing**: Use curl, Postman, or the generated `/docs` interface
- **Logs**: Check `/var/log/supervisor/backend.*.log` for debugging

This manual covers the most common editing scenarios. For complex modifications, always test changes thoroughly before deploying to production.