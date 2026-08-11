import sqlite3
import os
class Database:

    def __init__(self):
        from pathlib import Path

        DB_PATH = Path(__file__).resolve().parents[2] / "memoai.db"

        self.connection = sqlite3.connect(DB_PATH)
        print(os.path.abspath("memoai.db"))
        self.connection = sqlite3.connect("memoai.db")
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()
        
        self.cursor.execute("PRAGMA foreign_keys = ON")
        self.create_tables()
        print("Database Connected")
    def create_tables(self):
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                pages INTEGER NOT NULL,
                text TEXT NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )

        """)
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                document_id TEXT NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (document_id) REFERENCES documents(id)
        )
        
        """)
        

        self.connection.commit()
    def store_document(self,document_id,filename,pages,text):
        self.cursor.execute("""
        INSERT INTO documents (id,filename,pages,text)
        VALUES (?,?,?,?)
        """,
        (document_id,filename,pages,text)
        )
        
        self.connection.commit()
    def store_history(self,document_id,question,answer):
        self.cursor.execute("""
            INSERT INTO chat_history (document_id,question,answer)
            VALUES (?,?,?)
            """,
            (document_id,question,answer)
            )
            
        self.connection.commit()
    def show_documents(self):
        self.cursor.execute("SELECT * FROM documents")
        for row in self.cursor.fetchall():
         print(dict(row))
        
    def show_history(self):
        self.cursor.execute("SELECT * FROM chat_history")
        for row in self.cursor.fetchall():
            print(dict(row))
        
    def get_document(self, document_id):

        self.cursor.execute(
            """
            SELECT * FROM documents
            WHERE id = ?
            """,
            (document_id,)
        )

        document = self.cursor.fetchone()

        return document
    def get_history(self, document_id):
    
            self.cursor.execute(
                """
                SELECT * FROM chat_history
                WHERE document_id = ?
                ORDER BY created_at ASC
                """,
                (document_id,)
            )
    
            history = self.cursor.fetchall()
    
            return history
    def format_history(self, history):
        history_text = ""

        for chat in history:
            history_text += f"User: {chat['question']}\n"
            history_text += f"Assistant: {chat['answer']}\n\n"

        return history_text
database = Database()