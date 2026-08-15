from fastapi import HTTPException


def validate_pdf(filename):
    if not filename:
        raise HTTPException(
            status_code=400,
            detail="File must have a name"
        )

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be a PDF"
        )

    return True
    