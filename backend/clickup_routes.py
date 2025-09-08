#!/usr/bin/env python3
"""
FastAPI routes for ClickUp CRM integration
These routes replace the existing CRM functionality with ClickUp integration
"""

from fastapi import APIRouter, HTTPException, Query, Path, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
import secrets
import os

from clickup_integration import ClickUpCRMService, Contact, get_clickup_service, ClickUpAPIError

# Router for ClickUp CRM endpoints
clickup_router = APIRouter(prefix="/api/clickup", tags=["ClickUp CRM"])

# Basic authentication (same as your existing CRM)
security = HTTPBasic()

def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials"""
    correct_username = secrets.compare_digest(credentials.username, "admin")
    correct_password = secrets.compare_digest(credentials.password, "kioo2025!")
    
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# Pydantic models for API
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, regex=r'^\+?[1-9]\d{1,14}$')
    company: Optional[str] = Field(None, max_length=100)
    job_title: Optional[str] = Field(None, max_length=100)
    status: str = Field("new", description="Contact status")
    notes: Optional[str] = Field(None, max_length=1000)

class ContactUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, regex=r'^\+?[1-9]\d{1,14}$')
    company: Optional[str] = Field(None, max_length=100)
    job_title: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=1000)

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_date: Optional[str] = None
    updated_date: Optional[str] = None
    clickup_url: Optional[str] = None

# ClickUp CRM Endpoints

@clickup_router.get("/workspaces")
async def get_workspaces(
    username: str = Depends(verify_credentials),
    service: ClickUpCRMService = Depends(get_clickup_service)
):
    """Get available ClickUp workspaces"""
    try:
        workspaces = await service.get_workspaces()
        return {
            "workspaces": workspaces,
            "message": "Retrieved ClickUp workspaces successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get workspaces: {str(e)}")

@clickup_router.post("/contacts", response_model=ContactResponse)
async def create_contact(
    contact_data: ContactCreate,
    username: str = Depends(verify_credentials),
    service: ClickUpCRMService = Depends(get_clickup_service)
):
    """Create a new contact in ClickUp CRM"""
    try:
        # Convert to Contact model
        contact = Contact(**contact_data.dict())
        
        # Create in ClickUp
        result = await service.create_contact(contact)
        
        return ContactResponse(
            id=result["clickup_id"],
            name=contact.name,
            email=contact.email,
            phone=contact.phone,
            company=contact.company,
            job_title=contact.job_title,
            status=contact.status,
            notes=contact.notes,
            clickup_url=result.get("url")
        )
        
    except ClickUpAPIError as e:
        raise HTTPException(status_code=500, detail=f"ClickUp API error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create contact: {str(e)}")

@clickup_router.get("/contacts", response_model=Dict)
async def list_contacts(
    page: int = Query(0, ge=0, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Number of contacts per page"),
    status: Optional[str] = Query(None, description="Filter by status"),
    username: str = Depends(verify_credentials),
    service: ClickUpCRMService = Depends(get_clickup_service)
):
    """List contacts from ClickUp CRM"""
    try:
        result = await service.list_contacts(page=page, limit=limit, status_filter=status)
        
        # Format contacts for response
        formatted_contacts = []
        for contact in result["contacts"]:
            formatted_contacts.append(ContactResponse(**contact))
        
        return {
            "contacts": formatted_contacts,
            "total": result["total"],
            "page": page,
            "limit": limit,
            "has_more": result["has_more"]
        }
        
    except ClickUpAPIError as e:
        raise HTTPException(status_code=500, detail=f"ClickUp API error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list contacts: {str(e)}")

@clickup_router.get("/contacts/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: str = Path(..., description="ClickUp task ID"),
    username: str = Depends(verify_credentials),
    service: ClickUpCRMService = Depends(get_clickup_service)
):
    """Get a specific contact from ClickUp CRM"""
    try:
        contact = await service.get_contact(contact_id)
        return ContactResponse(**contact)
        
    except ClickUpAPIError as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail="Contact not found")
        raise HTTPException(status_code=500, detail=f"ClickUp API error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get contact: {str(e)}")

@clickup_router.put("/contacts/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: str,
    contact_update: ContactUpdate,
    username: str = Depends(verify_credentials),
    service: ClickUpCRMService = Depends(get_clickup_service)
):
    """Update an existing contact in ClickUp CRM"""
    try:
        # Get existing contact first
        existing_contact = await service.get_contact(contact_id)
        
        # Update only provided fields
        update_data = existing_contact.copy()
        for field, value in contact_update.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        # Convert to Contact model and update
        contact = Contact(**update_data)
        updated_contact = await service.update_contact(contact_id, contact)
        
        return ContactResponse(**updated_contact)
        
    except ClickUpAPIError as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail="Contact not found")
        raise HTTPException(status_code=500, detail=f"ClickUp API error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update contact: {str(e)}")

@clickup_router.delete("/contacts/{contact_id}")
async def delete_contact(
    contact_id: str,
    username: str = Depends(verify_credentials),
    service: ClickUpCRMService = Depends(get_clickup_service)
):
    """Delete a contact from ClickUp CRM"""
    try:
        result = await service.delete_contact(contact_id)
        return result
        
    except ClickUpAPIError as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail="Contact not found")
        raise HTTPException(status_code=500, detail=f"ClickUp API error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete contact: {str(e)}")

# Health check for ClickUp integration
@clickup_router.get("/health")
async def clickup_health_check(
    username: str = Depends(verify_credentials),
    service: ClickUpCRMService = Depends(get_clickup_service)
):
    """Check ClickUp integration health"""
    try:
        # Try to get workspaces to test connection
        workspaces = await service.get_workspaces()
        
        return {
            "status": "healthy",
            "clickup_connected": True,
            "workspaces_count": len(workspaces),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "clickup_connected": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Statistics endpoint
@clickup_router.get("/stats")
async def get_clickup_stats(
    username: str = Depends(verify_credentials),
    service: ClickUpCRMService = Depends(get_clickup_service)
):
    """Get ClickUp CRM statistics"""
    try:
        # Get all contacts to calculate stats
        all_contacts = await service.list_contacts(limit=1000)
        contacts = all_contacts["contacts"]
        
        # Calculate statistics
        stats = {
            "total_contacts": len(contacts),
            "status_breakdown": {},
            "companies": set(),
            "recent_contacts": 0
        }
        
        # Calculate status breakdown
        for contact in contacts:
            status = contact.get("status", "unknown")
            stats["status_breakdown"][status] = stats["status_breakdown"].get(status, 0) + 1
            
            if contact.get("company"):
                stats["companies"].add(contact["company"])
        
        stats["total_companies"] = len(stats["companies"])
        stats["companies"] = list(stats["companies"])  # Convert set to list for JSON
        
        return {
            "statistics": stats,
            "last_updated": datetime.now().isoformat(),
            "source": "ClickUp CRM"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")