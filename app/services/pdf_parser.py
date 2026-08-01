from pypdf import PdfReader
def parser(reader:PdfReader) -> str:
    text = ""
    
    for page in reader.pages:
        page_text = page.extract_text()
    
        if page_text:
            text += page_text
    return text