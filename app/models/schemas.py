from pydantic import BaseModel
class Question(BaseModel):
    question: str
class AskPdf(BaseModel):
    conversation_id : str
    question: str

