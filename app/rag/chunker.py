def chunk_text(text, chunk_size=500, overlap=100):

    # Return an empty list if there is no text
    if text == "":
        return []
    
    # Number of characters to move forward each time (for overlapping)
    step = chunk_size - overlap  

   
    chunks = []
    start = 0
    n = len(text)
    
    while start<n: 
     chunk = text[start:start + chunk_size] 
     chunks.append(chunk)
     start = start + step
        
    return chunks