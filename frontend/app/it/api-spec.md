# IT Specialist API Specification

This document defines the RESTful API contracts required to power the IT Specialist views, including Issues, Runbooks, and Settings. 

**Base URL:** `/api/v1`
**Authentication:** Standard Bearer Token (Authorization: Bearer `<token>`) or HttpOnly Session Cookie.

---

## 1. Issues & Tickets

Handles all interactions regarding the core ticketing system, Kanban boards, and AI escalations.

### `GET /issues`
Retrieves a list of issues. Used to populate the Inbox, Active Kanban board, Resolved queue, and AI Escalations.

**Query Parameters:**
- `status` (string, optional) - e.g., `Open,Auto-Escalated`
- `assignee` (string, optional) - e.g., `me` or user ID.
- `limit` (integer, optional) - Default `50`
- `offset` (integer, optional) - Default `0`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "IT-423",
      "title": "Network timeout on staging database",
      "status": "Auto-Escalated",
      "priority": "High",
      "assignee": "Sarah Jenkins",
      "createdAt": "2024-05-10T14:15:22Z"
    }
  ],
  "meta": { "total": 1, "limit": 50, "offset": 0 }
}
```

### `GET /issues/:id`
Retrieves the detailed view of a single issue, including the unified activity feed.

**Response:** `200 OK`
```json
{
  "data": {
    "id": "IT-423",
    "title": "Network timeout on staging database",
    "status": "Auto-Escalated",
    "priority": "High",
    "assignee": "Sarah Jenkins",
    "createdAt": "2024-05-10T14:15:22Z",
    "activityFeed": [
      {
        "id": "evt-001",
        "type": "System",
        "author": "User Endpoint",
        "timestamp": "2024-05-10T14:14:00Z",
        "message": "I'm getting a 504 Gateway Timeout..."
      },
      {
        "id": "evt-002",
        "type": "Agent",
        "author": "Archive Agent",
        "timestamp": "2024-05-10T14:15:00Z",
        "message": "I detected a network configuration drift...",
        "metadata": { "confidenceScore": 0.82 }
      }
    ]
  }
}
```

### `PATCH /issues/:id/status`
Updates the status of an issue. Primarily used by the Kanban drag-and-drop board.

**Request Body:**
```json
{
  "status": "In Progress"
}
```
**Response:** `200 OK` (Returns the updated Issue object).

### `POST /issues/:id/comments`
Adds a new comment or action to the issue's activity feed.

**Request Body:**
```json
{
  "message": "Looking into the VPC logs now."
}
```
**Response:** `201 Created` (Returns the newly created `ActivityEvent` object).

---

## 2. Runbooks

Manages Standard Operating Procedures (SOPs) available to human specialists and the AI Agent.

### `GET /runbooks`
Retrieves all available runbooks for the grid view.

**Query Parameters:**
- `status` (string, optional) - e.g., `Active`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "RB-001",
      "title": "Network Restoration via AWS NAT Gateway Reset",
      "author": "Infrastructure Team",
      "tags": ["AWS", "Network", "Automated"],
      "status": "Active"
    }
  ]
}
```

---

## 3. Settings

Manages user profile configuration and application preferences.

### `GET /settings/me`
Retrieves the settings for the currently authenticated IT Specialist.

**Response:** `200 OK`
```json
{
  "data": {
    "fullName": "Sarah Jenkins",
    "email": "sarah.jenkins@projectname.com",
    "preferences": {
      "compactQueueDensity": false,
      "showAiConfidenceScores": false
    }
  }
}
```

### `PATCH /settings/me`
Updates the specialist's preferences.

**Request Body:**
```json
{
  "preferences": {
    "compactQueueDensity": true
  }
}
```
**Response:** `200 OK` (Returns the updated Settings object).
