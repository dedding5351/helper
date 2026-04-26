from sqlalchemy.orm import Session
from app.models.issue import IssueDB, ActivityEventDB
from app.models.runbook import RunbookDB
from app.models.settings import UserSettingsDB
import json
from datetime import datetime

def seed_data(db: Session):
    # Check if we already seeded issues
    if db.query(IssueDB).first():
        return

    # --- Issues ---
    issues = [
        IssueDB(title="Network timeout on staging database", status="Auto-Escalated", priority="High", assignee="Sarah Jenkins", description="Users are reporting a 504 Gateway Timeout when trying to access the staging database via the internal tool. Logs show network configuration drift."),
        IssueDB(title="VPN connection drops intermittently", status="Open", priority="Medium", description="Multiple users working remotely are experiencing intermittent VPN drops every 30-45 minutes on macOS Sequoia."),
        IssueDB(title="Slack integration webhook failing", status="In Progress", priority="High", assignee="Sarah Jenkins", description="The Jira-to-Slack webhook is returning a 401 Unauthorized since the secret rotation yesterday."),
        IssueDB(title="New employee onboarding — laptop provisioning", status="Open", priority="Low", description="Standard onboarding for John Doe starting next Monday. Needs MacBook Pro 16\" and access to core services."),
        IssueDB(title="Production SSL certificate expiring in 7 days", status="Resolved", priority="Critical", assignee="System", description="Automated alert: wildcart cert for *.projectname.com is expiring in 7 days.")
    ]
    db.add_all(issues)
    db.commit()
    
    for i in issues:
        db.refresh(i)

    # --- Activity Events ---
    events = [
        # For IT-1
        ActivityEventDB(issue_id=issues[0].id, type="System", author="User Endpoint", message="I'm getting a 504 Gateway Timeout when trying to access the staging database via the internal tool. It was working 10 minutes ago."),
        ActivityEventDB(
            issue_id=issues[0].id, type="Agent", author="Archive Agent", 
            message="I detected a network configuration drift on the staging VPC. I have automatically applied the remediation runbook `net-restore-04` which reset the NAT gateway.\n\n**Status:** The timeout is fixed, but latency remains elevated at 450ms. I am auto-escalating to an IT Specialist for manual review of the VPC flow logs.", 
            metadata_json=json.dumps({"confidenceScore": 0.82})
        ),
        # For IT-2
        ActivityEventDB(issue_id=issues[1].id, type="System", author="Helpdesk Portal", message="User reported VPN dropping since updating to macOS 15.1."),
        # For IT-3
        ActivityEventDB(issue_id=issues[2].id, type="Agent", author="Security Agent", message="I noticed the webhook failing. Attempted to auto-rotate the key but the API endpoint was unreachable. Escalated."),
        ActivityEventDB(issue_id=issues[2].id, type="Human", author="Sarah Jenkins", message="Looking into the endpoint reachability now."),
        # For IT-4
        ActivityEventDB(issue_id=issues[3].id, type="Human", author="HR System", message="Onboarding ticket created automatically from Workday."),
        # For IT-5
        ActivityEventDB(issue_id=issues[4].id, type="System", author="CertBot", message="Certificate renewed successfully via ACME challenge."),
    ]
    db.add_all(events)

    # --- Runbooks ---
    runbooks = [
        RunbookDB(title="Network Restoration via AWS NAT Gateway Reset", author="Infrastructure Team", status="Active", tags_json=json.dumps(["AWS", "Network", "Automated"])),
        RunbookDB(title="SSL Certificate Rotation Playbook", author="Security Team", status="Active", tags_json=json.dumps(["Security", "SSL"])),
        RunbookDB(title="Employee Onboarding Checklist", author="HR IT", status="Draft", tags_json=json.dumps(["HR", "Provisioning"]))
    ]
    db.add_all(runbooks)

    # --- Settings ---
    settings = UserSettingsDB(
        id="default-user",
        full_name="Sarah Jenkins",
        email="sarah.jenkins@projectname.com",
        preferences_json=json.dumps({"compactQueueDensity": False, "showAiConfidenceScores": False})
    )
    db.add(settings)

    db.commit()
