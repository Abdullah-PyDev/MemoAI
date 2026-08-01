import streamlit as st
import requests

BACKEND_URL = "http://127.0.0.1:8000"

st.set_page_config(
    page_title="AI PDF Assistant",
    page_icon="📄",
    layout="wide"
)

st.title("📄 AI PDF Assistant")

# ----------------------------
# Session State
# ----------------------------

if "document_id" not in st.session_state:
    st.session_state["document_id"] = None

if "messages" not in st.session_state:
    st.session_state["messages"] = []

if "uploaded" not in st.session_state:
    st.session_state["uploaded"] = False

# ----------------------------
# Sidebar
# ----------------------------

with st.sidebar:

    st.header("📄 Upload PDF")

    uploaded_file = st.file_uploader(
        "Choose a PDF",
        type=["pdf"]
    )

    if uploaded_file:

        if st.button("Upload PDF"):

            files = {
                "file": (
                    uploaded_file.name,
                    uploaded_file,
                    "application/pdf"
                )
            }

            with st.spinner("Uploading..."):

                response = requests.post(
                    f"{BACKEND_URL}/upload",
                    files=files
                )

            if response.status_code == 200:

                result = response.json()

                st.session_state["document_id"] = result["document_id"]
                st.session_state["uploaded"] = True

                st.success("PDF uploaded successfully!")

            else:

                st.error(response.json())

    if st.session_state["uploaded"]:
        st.success("✅ Document Ready")

    st.divider()

    if st.button("🗑 Clear Chat"):
        st.session_state["messages"] = []
        st.rerun()

# ----------------------------
# Display Chat History
# ----------------------------

for message in st.session_state["messages"]:

    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# ----------------------------
# Chat Input
# ----------------------------

question = st.chat_input("Ask anything about your PDF...")

if question:

    if not st.session_state["document_id"]:
        st.warning("Please upload a PDF first.")
        st.stop()

    # Show User Message
    st.session_state["messages"].append({
        "role": "user",
        "content": question
    })

    with st.chat_message("user"):
        st.markdown(question)

    data = {
        "document_id": st.session_state["document_id"],
        "question": question
    }

    with st.spinner("Gemini is thinking..."):

        response = requests.post(
            f"{BACKEND_URL}/ask-pdf",
            json = data
        )

    if response.status_code == 200:

        answer = response.json()["answer"]

        st.session_state["messages"].append({
            "role": "assistant",
            "content": answer
        })

        with st.chat_message("assistant"):
            st.markdown(answer)

    else:

        error = response.json().get("detail", "Something went wrong.")

        with st.chat_message("assistant"):
            st.error(error)