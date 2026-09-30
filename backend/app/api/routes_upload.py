from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.models.schemas import ConversationAnalytics
from app.parser.whatsapp_parser import parse_whatsapp_text
from app.analytics.engine import run_analytics

router = APIRouter(tags=["upload"])

@router.post("/upload", response_model=ConversationAnalytics)
async def upload_whatsapp_chat(
    file: UploadFile = File(...),
    threshold_hours: int = Form(3)
):
    """
    Upload and parse a WhatsApp export (.txt).
    Computes analytics and returns aggregated results immediately.
    Raw content is NOT permanently stored on the server.
    """
    if not file.filename.endswith(".txt"):
        raise HTTPException(
            status_code=400,
            detail="Only .txt files from WhatsApp chat export are supported."
        )

    try:
        content_bytes = await file.read()
        raw_text = content_bytes.decode("utf-8", errors="replace")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    messages, sys_count, err_count = parse_whatsapp_text(raw_text)

    if not messages:
        raise HTTPException(
            status_code=422,
            detail="We couldn't recognize this WhatsApp export format. Please export without media and upload the .txt file."
        )

    try:
        analytics = run_analytics(messages, threshold_hours=threshold_hours)
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics calculation error: {str(e)}")
