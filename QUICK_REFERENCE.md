# 🚀 Kioo Radio - Quick Reference Card

## 📝 Most Common Editing Tasks

### ✅ Add New Radio Program
```bash
curl -X POST "https://radio-dashboard-4.preview.emergentagent.com/api/programs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your Program Name",
    "description": "Program description", 
    "host": "Host Name",
    "language": "english",
    "category": "talk", 
    "day_of_week": "monday",
    "start_time": "10:00",
    "duration_minutes": 60
  }'
```

### ✅ Add News Update
```bash
curl -X POST "https://radio-dashboard-4.preview.emergentagent.com/api/news" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "News Title",
    "content": "Full article content...", 
    "excerpt": "Short summary...",
    "author": "Author Name"
  }'
```

### ✅ Add Impact Story
```bash
curl -X POST "https://radio-dashboard-4.preview.emergentagent.com/api/impact-stories" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Story Title",
    "content": "Full story...",
    "author_name": "Person Name", 
    "author_location": "City, Country",
    "is_featured": true
  }'
```

## 🔧 Service Management
```bash
# Restart backend after changes
sudo supervisorctl restart backend

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.*.log
```

## 📊 View Current Data
```bash
# View all programs
curl "https://radio-dashboard-4.preview.emergentagent.com/api/programs"

# View donation total  
curl "https://radio-dashboard-4.preview.emergentagent.com/api/donations/total"

# View all news
curl "https://radio-dashboard-4.preview.emergentagent.com/api/news"
```

## 📱 Website URLs
- **Live Site**: https://radio-dashboard-4.preview.emergentagent.com
- **API Docs**: https://radio-dashboard-4.preview.emergentagent.com/docs (Coming soon)
- **API Root**: https://radio-dashboard-4.preview.emergentagent.com/api/

## 🎛️ Valid Values

### Languages:
- `english`, `french`, `kissi`, `krio`

### Categories: 
- `news`, `music`, `talk`, `religious`, `youth`, `farming`, `community`

### Days:
- `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`

### Time Format:
- Use 24-hour format: `"09:00"`, `"14:30"`, `"18:00"`

## 🆘 Emergency Commands
```bash
# If website is down - restart all services
sudo supervisorctl restart all

# Check what's wrong
sudo supervisorctl status
tail -n 20 /var/log/supervisor/backend.err.log

# Test if API is responding
curl "https://radio-dashboard-4.preview.emergentagent.com/api/"
```