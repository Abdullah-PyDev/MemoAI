import fitz

from app.models.document import Document, Page, Block


class PdfParser:

    def parse_pdf(self, pdf_data: bytes) -> Document:
        doc = fitz.open(stream=pdf_data, filetype="pdf")
        metadeta = doc.metadata
        title = metadeta.get("title")
        author = metadeta.get("author")
        document = Document(title,author)
        
        for page_number, pdf_page in enumerate(doc,start = 1):
            page = Page(number=page_number)
            page_dict = pdf_page.get_text("dict")
            for block in page_dict["blocks"]:
                text = ""
                if block["type"] != 0:
                    continue
                for lines in block["lines"]:
                    for span in lines["spans"]:
                            text+=span["text"]

                #right logic for finding text
                block_obj = Block(type="text",bbox=block["bbox"],page=page_number,text=text)
                page.blocks.append(block_obj)
            document.pages.append(page)
        return document
    
parser = PdfParser()