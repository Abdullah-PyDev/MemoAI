from fastapi import APIRouter
router = APIRouter()
# Home route
@router.get("/")
def home():
    return {
        "message": "Welcome to Ask Anything AI!",
        "docs": "/docs"
    }
@router.get("/help")
def help():
    return {
        "message": "How may i help u!",
        "docs": "/docs"
    }