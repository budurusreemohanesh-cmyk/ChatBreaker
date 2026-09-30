from fastapi import APIRouter, HTTPException
from app.models.schemas import AnalyzeRequest, ConversationAnalytics
from app.parser.whatsapp_parser import parse_whatsapp_text
from app.analytics.engine import run_analytics

router = APIRouter(tags=["analysis"])

@router.post("/analyze", response_model=ConversationAnalytics)
async def analyze_chat(request: AnalyzeRequest):
    """
    Accepts raw_text or pre-parsed normalized messages and returns complete analytics.
    """
    if request.messages:
        messages = request.messages
    elif request.raw_text:
        messages, _, _ = parse_whatsapp_text(request.raw_text)
    else:
        raise HTTPException(status_code=400, detail="Either raw_text or messages must be provided.")

    if not messages:
        raise HTTPException(status_code=422, detail="No valid messages found to analyze.")

    try:
        return run_analytics(messages, threshold_hours=request.threshold_hours)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics computation error: {str(e)}")
