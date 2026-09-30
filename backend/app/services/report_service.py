import uuid
from datetime import datetime
from typing import Dict, Optional
from app.models.schemas import ConversationAnalytics, ReportResponse

# In-memory storage for saved aggregated reports (or backed by Supabase PostgreSQL)
# Notice: NEVER stores raw messages, only privacy-safe aggregated analytics!
_REPORTS_STORE: Dict[str, dict] = {}

class ReportService:
    @staticmethod
    def create_report(title: str, analytics: ConversationAnalytics) -> ReportResponse:
        report_id = f"report_{uuid.uuid4().hex[:12]}"
        now_str = datetime.utcnow().isoformat() + "Z"

        record = {
            "id": report_id,
            "title": title,
            "createdAt": now_str,
            "analytics": analytics.model_dump()
        }

        _REPORTS_STORE[report_id] = record

        return ReportResponse(
            id=report_id,
            title=title,
            createdAt=now_str,
            analytics=analytics
        )

    @staticmethod
    def get_report(report_id: str) -> Optional[ReportResponse]:
        record = _REPORTS_STORE.get(report_id)
        if not record:
            return None

        return ReportResponse(
            id=record["id"],
            title=record["title"],
            createdAt=record["createdAt"],
            analytics=ConversationAnalytics(**record["analytics"])
        )

    @staticmethod
    def delete_report(report_id: str) -> bool:
        if report_id in _REPORTS_STORE:
            del _REPORTS_STORE[report_id]
            return True
        return False
