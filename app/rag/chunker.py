from app.models.document import Document


def is_heading(block):
    if block.font_size and block.font_size >= 16:
        return True

    if block.is_bold and len(block.text) < 100:
        return True

    return False


def vertical_gap(previous_block, current_block):
    if previous_block is None:
        return 0

    previous_bottom = previous_block.bbox[3]
    current_top = current_block.bbox[1]

    return current_top - previous_bottom


def chunk_text(document: Document, chunk_size=1000, gap_threshold=40):
    chunks = []

    current_chunk = []
    current_length = 0

    previous_block = None

    for page in document.pages:

        for block in page.blocks:

            text = block.text.strip()

            if not text:
                continue

            start_new_chunk = False

            if is_heading(block):
                start_new_chunk = True

            elif previous_block and vertical_gap(previous_block, block) > gap_threshold:
                start_new_chunk = True

            elif current_length + len(text) > chunk_size:
                start_new_chunk = True

            if start_new_chunk and current_chunk:
                chunks.append("\n".join(current_chunk))
                current_chunk = []
                current_length = 0

            current_chunk.append(text)
            current_length += len(text)

            previous_block = block

    if current_chunk:
        chunks.append("\n".join(current_chunk))

    return chunks