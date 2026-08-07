from dataclasses import dataclass, field


@dataclass
class Block:
    type: str
    text: str
    page: int
    bbox: tuple | None = None
    font_size: float | None = None
    font_name: str | None = None
    is_bold: bool = False


@dataclass
class Page:
    number: int
    blocks: list[Block] = field(default_factory=list)


@dataclass
class Document:
    title: str
    author: str
    pages: list[Page] = field(default_factory=list)