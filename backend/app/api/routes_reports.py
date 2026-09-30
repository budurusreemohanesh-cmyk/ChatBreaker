from fastapi import APIRouter, HTTPException
from app.models.schemas import ReportCreateRequest, ReportResponse
from app.services.report_service import ReportService

router = APIRouter(tags=["reports"])

@router.post("/report", response_model=ReportResponse)
async def save_report(request: ReportCreateRequest):
    """
    Saves an aggregated report (metadata + stats).
    Does NOT store raw chat messages.
    """
    return ReportService.create_report(request.title, request.analytics)

@router.get("/report/{report_id}", response_model=ReportResponse)
async def get_report(report_id: str):
    """
    Retrieves a previously saved aggregated report by ID.
    """
    report = ReportService.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.delete("/report/{report_id}")
async def delete_report(report_id: str):
    """
    Permanently deletes a report by ID.
    """
    deleted = ReportService.delete_report(report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"status": "deleted", "id": report_id}
