import sqlite3
import os
import uuid
class Database:

    def __init__(self):
        from pathlib import Path

        DB_PATH = Path(__file__).resolve().parents[2] / "memoai.db"

        self.connection = sqlite3.connect(DB_PATH,check_same_thread=False)
    
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
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        self.cursor.execute("PRAGMA table_info(chat_history)")
        columns = [column[1] for column in self.cursor.fetchall()]

        if "conversation_id" not in columns:
            self.cursor.execute("""
                ALTER TABLE chat_history
                ADD COLUMN conversation_id TEXT
            """)
        self.cursor.execute("PRAGMA table_info(conversations)")
        columns = [column[1] for column in self.cursor.fetchall()]
        
        if "active_document_id" not in columns:
            self.cursor.execute("""
                ALTER TABLE conversations
                ADD COLUMN active_document_id TEXT
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
    
    def update_conversation_title(self, conversation_id, title):
        self.cursor.execute(
            """
            UPDATE conversations
            SET title = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (title, conversation_id)
        )

        self.connection.commit()
    def store_history(self,conversation_id,document_id,question,answer):
        self.cursor.execute("""
            INSERT INTO chat_history (conversation_id,document_id,question,answer)
            VALUES (?,?,?,?)
            """,
            (conversation_id,document_id,question,answer)
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
        print("LOOKING FOR DOCUMENT:", document_id)
        self.cursor.execute(
            """
            SELECT * FROM documents
            WHERE id = ?
            """,
            (document_id,)
        )
        
        document = self.cursor.fetchone()
        print("DOCUMENT FOUND:", document)

        return document
    def create_conversation(self,title="New Conversation"):
        active_document_id = None
        conversation_id = str(uuid.uuid4())
        self.cursor.execute("""
            INSERT INTO conversations (id,title,active_document_id)
            VALUES (?,?,?)
            """,
            (conversation_id,title,active_document_id)
        )
        self.connection.commit()
        return conversation_id
    def get_conversations(self):
            self.cursor.execute("""
                SELECT * FROM conversations
                ORDER BY updated_at DESC
            """)
            conversations = self.cursor.fetchall()
            return conversations
    def set_active_document(self, conversation_id, document_id):
        self.cursor.execute("""
            UPDATE conversations
            SET active_document_id = ?
            WHERE id = ?
        """, (
            document_id,
            conversation_id
        ))

        self.connection.commit()


    def get_conversation(self, conversation_id):
        self.cursor.execute("""
            SELECT * FROM conversations
            WHERE id = ?
        """, (conversation_id,))

        conversation = self.cursor.fetchone()

        return conversation
    def get_active_document_id(self,conversation_id):
        self.cursor.execute("""
            SELECT active_document_id
            FROM conversations
            WHERE id = ?
        """, (conversation_id,)
        )
        row = self.cursor.fetchone()
        if row:
            return row["active_document_id"]
        return None
    def get_conversation_messages(self,conversation_id):
        self.cursor.execute(
        """
        SELECT * FROM chat_history
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        """,
        (conversation_id,)
        )
        chats = self.cursor.fetchall()
        return chats
    def get_history(self, conversation_id):
    
            self.cursor.execute(
                """
                SELECT * FROM chat_history
                WHERE conversation_id = ?
                ORDER BY created_at ASC
                """,
                (conversation_id,)
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