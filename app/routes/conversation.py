from fastapi import APIRouter
from app.db.db import database as db
from fastapi import HTTPException
router = APIRouter()
@router.post("/conversations")
def create_conversation():
    conversation_id = db.create_conversation()

    return {
        "conversation_id": conversation_id
    }
@router.get("/conversations")
def get_conversations():
    conversations = db.get_conversations()

    return {
        "conversations": conversations
    }
@router.get("/conversations/{conversation_id}")
def get_conversation(conversation_id):
    conversation = db.get_conversation(conversation_id)

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    chat = db.get_conversation_messages(conversation_id)

    active_document = None

    if conversation["active_document_id"]:
        active_document = db.get_document(
            conversation["active_document_id"]
        )
        

    return {
        "conversation": dict(conversation),
        "chat": chat,
        "document": dict(active_document) if active_document else None,
    }
@router.get("/conversations/{conversation_id}/messages")
def get_chat(conversation_id):
    messages = db.get_conversation_messages(conversation_id)
    return {
        "messages":messages
    }
@router.patch("/conversations/{conversation_id}/document")
def set_active_document(conversation_id:str,document_id:str):
    db.set_active_document(conversation_id,document_id)
    return {
        "conversation_id":conversation_id,
        "document_id": document_id
    }

@router.patch("/conversations/{conversation_id}/title")
def update_conversation_title(conversation_id: str, title: str):
    db.update_conversation_title(conversation_id, title)

    return {
        "conversation_id": conversation_id,
        "title": title
    }
@router.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: str):
    deleted = db.delete_conversation(conversation_id)
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )
    return {
        "message": "Conversation deleted successfully",
        "conversation_id": conversation_id
    }