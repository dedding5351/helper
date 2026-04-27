"""
Agent Tools — Custom function tools for the LiveKit voice agent.

Each tool makes async HTTP calls to the FastAPI backend to access
business logic and data. Tools are defined as standalone functions
so they can be shared across multiple agent classes if needed.

Usage:
    from workers.agent_tools import ALL_TOOLS

    class MyAgent(Agent):
        def __init__(self):
            super().__init__(tools=ALL_TOOLS, ...)
"""

import json
import os
import logging

import aiohttp
from livekit.agents import function_tool, RunContext
from livekit.agents.llm import ToolError

logger = logging.getLogger("helper-agent.tools")

BACKEND_URL = os.getenv("BACKEND_API_URL", "http://localhost:8000/api/v1")
REQUEST_TIMEOUT = aiohttp.ClientTimeout(total=10)


# ---------------------------------------------------------------------------
# Knowledge Base
# ---------------------------------------------------------------------------

@function_tool()
async def search_knowledge_base(context: RunContext, query: str) -> str:
    """Search the IT knowledge base for solutions to technical problems.

    Use this tool when the user asks about troubleshooting steps, runbook
    procedures, or technical how-to questions. Returns the most relevant
    knowledge base excerpts.

    Args:
        query: The user's technical problem or question.
    """
    logger.info("Tool call: search_knowledge_base(query=%r)", query)
    async with aiohttp.ClientSession(timeout=REQUEST_TIMEOUT) as session:
        async with session.get(
            f"{BACKEND_URL}/runbooks/search",
            params={"q": query},
        ) as resp:
            if resp.status != 200:
                raise ToolError("Knowledge base search is currently unavailable.")
            data = await resp.json()
            if not data:
                return "No relevant knowledge base articles were found for that query."
            # Format results for the LLM to summarize naturally
            results = []
            for item in data[:5]:
                content = item.get("content", item.get("document", ""))
                source = item.get("source", "Unknown")
                results.append(f"[Source: {source}] {content[:500]}")
            return "\n---\n".join(results)


# ---------------------------------------------------------------------------
# Issue / Ticket Management
# ---------------------------------------------------------------------------

@function_tool()
async def lookup_issue(context: RunContext, issue_id: str) -> str:
    """Look up the details of a specific IT support ticket.

    Args:
        issue_id: The ticket identifier, for example IT-1 or IT-12.
    """
    logger.info("Tool call: lookup_issue(issue_id=%r)", issue_id)
    # Normalize: accept "IT-1", "1", "it-1"
    clean_id = issue_id.upper().replace("IT-", "")
    async with aiohttp.ClientSession(timeout=REQUEST_TIMEOUT) as session:
        async with session.get(f"{BACKEND_URL}/issues/{clean_id}") as resp:
            if resp.status == 404:
                return f"No ticket found with ID {issue_id}."
            if resp.status != 200:
                raise ToolError(f"Failed to look up ticket {issue_id}.")
            data = await resp.json()
            issue = data.get("data", data)
            return json.dumps(issue, default=str)


@function_tool()
async def list_open_issues(context: RunContext) -> str:
    """List all currently open or escalated IT support tickets.

    Use this when the user asks about their tickets, pending issues,
    or wants an overview of what's in the queue.
    """
    logger.info("Tool call: list_open_issues()")
    async with aiohttp.ClientSession(timeout=REQUEST_TIMEOUT) as session:
        async with session.get(
            f"{BACKEND_URL}/issues/",
            params={"limit": 10},
        ) as resp:
            if resp.status != 200:
                raise ToolError("Could not retrieve the issue list.")
            data = await resp.json()
            issues = data.get("data", [])
            if not issues:
                return "There are no open tickets at the moment."
            summaries = []
            for issue in issues:
                summaries.append(
                    f"- {issue.get('id')}: {issue.get('title')} "
                    f"[{issue.get('status')}] (Priority: {issue.get('priority')})"
                )
            return "\n".join(summaries)


@function_tool()
async def create_issue(
    context: RunContext,
    title: str,
    description: str,
    priority: str = "Medium",
) -> str:
    """Create a new IT support ticket on behalf of the user.

    Use this when the user reports a new problem and wants to file a ticket.
    Confirm the details with the user before calling this tool.

    Args:
        title: A short, descriptive title for the issue.
        description: Detailed description of the problem.
        priority: One of Critical, High, Medium, or Low.
    """
    logger.info("Tool call: create_issue(title=%r, priority=%r)", title, priority)
    # Prevent interruptions — this is a mutating action
    context.disallow_interruptions()

    payload = {
        "title": title,
        "description": description,
        "priority": priority,
        "status": "Open",
    }
    async with aiohttp.ClientSession(timeout=REQUEST_TIMEOUT) as session:
        async with session.post(
            f"{BACKEND_URL}/issues/",
            json=payload,
        ) as resp:
            if resp.status not in (200, 201):
                raise ToolError("Failed to create the ticket. Please try again.")
            data = await resp.json()
            issue = data.get("data", data)
            return f"Ticket {issue.get('id')} has been created successfully."


@function_tool()
async def update_issue_status(
    context: RunContext,
    issue_id: str,
    new_status: str,
) -> str:
    """Update the status of an existing IT support ticket.

    Args:
        issue_id: The ticket identifier, for example IT-1.
        new_status: The new status. One of Open, In Progress, Resolved, or Auto-Escalated.
    """
    logger.info("Tool call: update_issue_status(issue_id=%r, status=%r)", issue_id, new_status)
    context.disallow_interruptions()

    clean_id = issue_id.upper().replace("IT-", "")
    payload = {"status": new_status}
    async with aiohttp.ClientSession(timeout=REQUEST_TIMEOUT) as session:
        async with session.patch(
            f"{BACKEND_URL}/issues/{clean_id}",
            json=payload,
        ) as resp:
            if resp.status == 404:
                return f"No ticket found with ID {issue_id}."
            if resp.status != 200:
                raise ToolError(f"Failed to update ticket {issue_id}.")
            return f"Ticket {issue_id} has been updated to {new_status}."


# ---------------------------------------------------------------------------
# Export all tools as a single list for easy agent registration
# ---------------------------------------------------------------------------

ALL_TOOLS = [
    search_knowledge_base,
    lookup_issue,
    list_open_issues,
    create_issue,
    update_issue_status,
]
