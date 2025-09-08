#!/usr/bin/env python3
"""
ClickUp CRM Integration Service
This module provides a complete integration between your FastAPI backend and ClickUp API
"""

import os
import requests
import json
import time
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, Field
from fastapi import HTTPException
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ClickUpAPIError(Exception):
    """Custom exception for ClickUp API errors"""
    def __init__(self, message: str, status_code: int = None, response_data: dict = None):
        self.message = message
        self.status_code = status_code
        self.response_data = response_data
        super().__init__(self.message)

class Contact(BaseModel):
    """Contact model for CRM"""
    id: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, regex=r'^\+?[1-9]\d{1,14}$')
    company: Optional[str] = Field(None, max_length=100)
    job_title: Optional[str] = Field(None, max_length=100)
    status: str = "new"
    notes: Optional[str] = None
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None

class ClickUpClient:
    """ClickUp API client for CRM operations"""
    
    def __init__(self, api_token: str = None):
        self.api_token = api_token or os.getenv("CLICKUP_API_TOKEN")
        if not self.api_token:
            raise ValueError("ClickUp API token is required. Set CLICKUP_API_TOKEN environment variable.")
        
        self.base_url = "https://api.clickup.com/api/v2"
        self.headers = {
            "Authorization": self.api_token,
            "Content-Type": "application/json"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
        # Rate limiting
        self.last_request_time = 0
        self.request_count = 0
        self.rate_limit_window = 60
        self.max_requests_per_window = 100
        
        logger.info("ClickUp client initialized successfully")
    
    def _handle_rate_limiting(self):
        """Handle rate limiting to respect ClickUp's limits"""
        current_time = time.time()
        
        if current_time - self.last_request_time > self.rate_limit_window:
            self.request_count = 0
            self.last_request_time = current_time
        
        if self.request_count >= self.max_requests_per_window:
            sleep_time = self.rate_limit_window - (current_time - self.last_request_time)
            if sleep_time > 0:
                logger.warning(f"Rate limit reached, sleeping for {sleep_time} seconds")
                time.sleep(sleep_time)
                self.request_count = 0
                self.last_request_time = time.time()
        
        self.request_count += 1
    
    def _make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> Dict:
        """Make authenticated request to ClickUp API"""
        self._handle_rate_limiting()
        
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                params=params,
                timeout=30
            )
            
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', 60))
                logger.warning(f"Rate limit exceeded, waiting {retry_after} seconds")
                time.sleep(retry_after)
                return self._make_request(method, endpoint, data, params)
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.HTTPError as e:
            error_data = None
            try:
                error_data = response.json()
            except:
                pass
            
            raise ClickUpAPIError(
                message=f"HTTP {response.status_code}: {str(e)}",
                status_code=response.status_code,
                response_data=error_data
            )
        except requests.exceptions.RequestException as e:
            raise ClickUpAPIError(f"Request failed: {str(e)}")
    
    def get(self, endpoint: str, params: Dict = None) -> Dict:
        return self._make_request("GET", endpoint, params=params)
    
    def post(self, endpoint: str, data: Dict = None) -> Dict:
        return self._make_request("POST", endpoint, data=data)
    
    def put(self, endpoint: str, data: Dict = None) -> Dict:
        return self._make_request("PUT", endpoint, data=data)
    
    def delete(self, endpoint: str) -> Dict:
        return self._make_request("DELETE", endpoint)

class ClickUpCRMService:
    """High-level CRM service using ClickUp"""
    
    def __init__(self, clickup_client: ClickUpClient, workspace_id: str, contacts_list_id: str):
        self.client = clickup_client
        self.workspace_id = workspace_id
        self.contacts_list_id = contacts_list_id
        
        logger.info(f"ClickUp CRM Service initialized for workspace: {workspace_id}")
    
    async def get_workspaces(self) -> List[Dict]:
        """Get available workspaces"""
        try:
            response = self.client.get("team")
            return response.get("teams", [])
        except ClickUpAPIError as e:
            logger.error(f"Failed to get workspaces: {e.message}")
            return []
    
    async def create_contact(self, contact: Contact) -> Dict:
        """Create a new contact in ClickUp as a task"""
        try:
            task_data = {
                "name": f"Contact: {contact.name}",
                "description": f"""
Contact Information:
- Name: {contact.name}
- Email: {contact.email}
- Phone: {contact.phone or 'Not provided'}
- Company: {contact.company or 'Not provided'}
- Job Title: {contact.job_title or 'Not provided'}
- Status: {contact.status}
- Notes: {contact.notes or 'No additional notes'}
                """.strip(),
                "status": self._map_contact_status(contact.status),
                "priority": 3,
                "tags": ["contact", contact.status],
                "assignees": [],
                "custom_fields": []
            }
            
            response = self.client.post(f"list/{self.contacts_list_id}/task", task_data)
            
            logger.info(f"Created contact: {contact.name} with ClickUp ID: {response['id']}")
            return {
                "clickup_id": response["id"],
                "name": contact.name,
                "email": contact.email,
                "url": response.get("url"),
                "status": "created"
            }
            
        except ClickUpAPIError as e:
            logger.error(f"Failed to create contact {contact.name}: {e.message}")
            raise HTTPException(status_code=500, detail=f"Failed to create contact: {e.message}")
    
    async def get_contact(self, task_id: str) -> Dict:
        """Get a contact by ClickUp task ID"""
        try:
            response = self.client.get(f"task/{task_id}")
            return self._format_contact_response(response)
        except ClickUpAPIError as e:
            logger.error(f"Failed to get contact {task_id}: {e.message}")
            raise HTTPException(status_code=404, detail=f"Contact not found: {e.message}")
    
    async def update_contact(self, task_id: str, contact: Contact) -> Dict:
        """Update an existing contact"""
        try:
            update_data = {
                "name": f"Contact: {contact.name}",
                "description": f"""
Contact Information:
- Name: {contact.name}
- Email: {contact.email}
- Phone: {contact.phone or 'Not provided'}
- Company: {contact.company or 'Not provided'}
- Job Title: {contact.job_title or 'Not provided'}
- Status: {contact.status}
- Notes: {contact.notes or 'No additional notes'}
                """.strip(),
                "status": self._map_contact_status(contact.status)
            }
            
            response = self.client.put(f"task/{task_id}", update_data)
            
            logger.info(f"Updated contact: {task_id}")
            return self._format_contact_response(response)
            
        except ClickUpAPIError as e:
            logger.error(f"Failed to update contact {task_id}: {e.message}")
            raise HTTPException(status_code=500, detail=f"Failed to update contact: {e.message}")
    
    async def delete_contact(self, task_id: str) -> Dict:
        """Delete a contact"""
        try:
            self.client.delete(f"task/{task_id}")
            logger.info(f"Deleted contact: {task_id}")
            return {"message": "Contact deleted successfully", "task_id": task_id}
        except ClickUpAPIError as e:
            logger.error(f"Failed to delete contact {task_id}: {e.message}")
            raise HTTPException(status_code=500, detail=f"Failed to delete contact: {e.message}")
    
    async def list_contacts(self, page: int = 0, limit: int = 50, status_filter: str = None) -> Dict:
        """List contacts with pagination"""
        try:
            params = {
                "page": page,
                "order_by": "created",
                "reverse": True,
                "subtasks": False,
                "include_closed": True
            }
            
            if status_filter:
                params["statuses[]"] = self._map_contact_status(status_filter)
            
            response = self.client.get(f"list/{self.contacts_list_id}/task", params=params)
            
            contacts = []
            for task in response.get("tasks", []):
                if "contact" in [tag["name"] for tag in task.get("tags", [])]:
                    contacts.append(self._format_contact_response(task))
            
            return {
                "contacts": contacts,
                "total": len(contacts),
                "page": page,
                "has_more": len(response.get("tasks", [])) == limit
            }
            
        except ClickUpAPIError as e:
            logger.error(f"Failed to list contacts: {e.message}")
            raise HTTPException(status_code=500, detail=f"Failed to list contacts: {e.message}")
    
    def _map_contact_status(self, crm_status: str) -> str:
        """Map CRM contact status to ClickUp task status"""
        status_mapping = {
            "new": "to do",
            "contacted": "in progress",
            "qualified": "in progress", 
            "customer": "complete",
            "lost": "closed"
        }
        return status_mapping.get(crm_status, "to do")
    
    def _format_contact_response(self, task_data: Dict) -> Dict:
        """Format ClickUp task data as CRM contact"""
        description = task_data.get("description", "")
        
        # Extract information from description
        email = self._extract_from_description(description, "Email")
        phone = self._extract_from_description(description, "Phone")  
        company = self._extract_from_description(description, "Company")
        job_title = self._extract_from_description(description, "Job Title")
        
        return {
            "id": task_data["id"],
            "name": task_data["name"].replace("Contact: ", ""),
            "email": email,
            "phone": phone if phone != "Not provided" else None,
            "company": company if company != "Not provided" else None,
            "job_title": job_title if job_title != "Not provided" else None,
            "status": self._reverse_map_status(task_data.get("status", {}).get("status", "")),
            "created_date": task_data.get("date_created"),
            "updated_date": task_data.get("date_updated"),
            "clickup_url": task_data.get("url"),
            "tags": [tag["name"] for tag in task_data.get("tags", [])]
        }
    
    def _extract_from_description(self, description: str, field: str) -> str:
        """Extract field value from description"""
        import re
        pattern = f"- {field}: (.+)"
        match = re.search(pattern, description)
        return match.group(1) if match else ""
    
    def _reverse_map_status(self, clickup_status: str) -> str:
        """Reverse map ClickUp status to CRM status"""
        reverse_mapping = {
            "to do": "new",
            "in progress": "contacted", 
            "complete": "customer",
            "closed": "lost"
        }
        return reverse_mapping.get(clickup_status.lower(), "new")

# Initialize service (you'll need to set these environment variables)
def get_clickup_service() -> ClickUpCRMService:
    """Get configured ClickUp CRM service"""
    api_token = os.getenv("CLICKUP_API_TOKEN")
    workspace_id = os.getenv("CLICKUP_WORKSPACE_ID") 
    contacts_list_id = os.getenv("CLICKUP_CONTACTS_LIST_ID")
    
    if not all([api_token, workspace_id, contacts_list_id]):
        # Return None or raise a more specific error that can be handled
        from fastapi import HTTPException
        raise HTTPException(
            status_code=501, 
            detail="ClickUp integration not configured. Please set CLICKUP_API_TOKEN, CLICKUP_WORKSPACE_ID, and CLICKUP_CONTACTS_LIST_ID environment variables."
        )
    
    client = ClickUpClient(api_token)
    return ClickUpCRMService(client, workspace_id, contacts_list_id)

if __name__ == "__main__":
    # Test the integration
    service = get_clickup_service()
    print("ClickUp CRM Integration ready!")