"""
===========================================
PYTHON FOR AGENTIC AI
Lecture 13 - Dictionaries
Instructor Script
===========================================

Today's Goal:
- Understand what dictionaries are
- Create dictionaries
- Access values
- Update values
- Add new key-value pairs
- Delete data
- Use useful dictionary methods
- Loop through dictionaries
- Build real-world examples
"""

print("=" * 50)
print("LECTURE 13 - DICTIONARIES")
print("=" * 50)

# ============================================================
# PART 1 - WHY DO WE NEED DICTIONARIES?
# ============================================================

print("\n--- Why Dictionaries? ---")

name = "Ali"
age = 20
city = "Lahore"

print("Without Dictionary")
print(name)
print(age)
print(city)

print("\nImagine storing 10,000 students like this...")
print("There must be a better way!")

# ============================================================
# PART 2 - CREATING A DICTIONARY
# ============================================================

print("\n--- Creating a Dictionary ---")
# dictionary_name = {}
student = {
    "name": "Ali",
    "age": 20,
    "city": "Lahore"
}

print(student)

# ============================================================
# PART 3 - ACCESSING VALUES
# ============================================================

print("\n--- Accessing Values ---")

print("Name:", student["name"])
print("Age:", student["age"])
print("City:", student["city"])

# ============================================================
# PART 4 - UPDATING VALUES
# ============================================================

print("\n--- Updating Values ---")

student["age"] = 21

print(student)

# ============================================================
# PART 5 - ADDING NEW DATA
# ============================================================

print("\n--- Adding New Key ---")

student["cgpa"] = 3.75

print(student)

# ============================================================
# PART 6 - DELETING DATA
# ============================================================

print("\n--- Deleting Data ---")

del student["city"]

print(student)

# ============================================================
# PART 7 - LENGTH
# ============================================================

print("\n--- Length ---")

print("Number of key-value pairs:", len(student))

# ============================================================
# PART 8 - MEMBERSHIP
# ============================================================

print("\n--- Membership Operator ---")

print("name" in student)
print("salary" in student)

# ============================================================
# PART 9 - GET METHOD
# ============================================================

print("\n--- get() Method ---")

print(student.get("name"))
print(student.get("salary"))
print(student.get("salary", "Not Found"))

# ============================================================
# PART 10 - KEYS
# ============================================================

print("\n--- keys() ---")

print(student.keys())

print(list(student.keys()))

# ============================================================
# PART 11 - VALUES
# ============================================================

print("\n--- values() ---")

print(student.values())

print(list(student.values()))

# ============================================================
# PART 12 - ITEMS
# ============================================================

print("\n--- items() ---")

print(student.items())
"""
dict_item([("key","value")])
"""

# ============================================================
# PART 13 - LOOPING THROUGH DICTIONARY
# ============================================================

print("\n--- Loop: Keys ---")

for key in student:
    print(key)

print("\n--- Loop: Values ---")

for key in student:
    print(student[key])

print("\n--- Loop: Keys and Values ---")

for key, value in student.items():
    print(key, ":", value)

# ============================================================
# PART 14 - NESTED DICTIONARY
# ============================================================

print("\n--- Nested Dictionary ---")

student = {
    "name": "Ali",
    "marks": {
        "Math": 90,
        "Physics": 88,
        "English": 80
    }
}

print(student)

print("Physics Marks:", student["marks"]["Physics"])

# ============================================================
# PART 15 - LIST OF DICTIONARIES
# ============================================================

print("\n--- List of Dictionaries ---")

students = [
    {
        "name": "Ali",
        "age": 20
    },
    {
        "name": "Ahmed",
        "age": 22
    },
    {
        "name": "Sara",
        "age": 19
    }
]

print(students)

print("Second Student:", students[1]["name"])

# ============================================================
# PART 16 - AI EXAMPLE
# ============================================================

print("\n--- AI Response Example ---")

ai_response = {
    "question": "What is Python?",
    "answer": "Python is a programming language.",
    "model": "GPT-5",
    "tokens_used": 128,
    "success": True
}

print(ai_response)

print("\nAnswer:")
print(ai_response["answer"])

# ============================================================
# PART 17 - MINI PROJECT
# ============================================================

print("\n--- Mini Project : Student Record ---")

student = {}

student["name"] = input("Enter Name: ")
student["age"] = int(input("Enter Age: "))
student["course"] = input("Enter Course: ")
student["fee_paid"] = input("Fee Paid (Yes/No): ")

print("\nStudent Information")

for key, value in student.items():
    print(key, ":", value)

# ============================================================
# PART 18 - CHALLENGE
# ============================================================

print("\n==============================")
print("PRACTICE CHALLENGE")
print("==============================")

inventory = {
    "Laptop": 10,
    "Mouse": 35,
    "Keyboard": 20
}

item = input("Enter Item Name: ")

if item in inventory:
    print("Quantity:", inventory[item])
else:
    print("Item Not Available")

# ============================================================
# BONUS - LOGIN SYSTEM
# ============================================================

print("\n==============================")
print("BONUS EXAMPLE - LOGIN SYSTEM")
print("==============================")

users = [
    {
        "username": "admin",
        "password": "1234"
    },
    {
        "username": "ali",
        "password": "abcd"
    },
    {
        "username": "sara",
        "password": "pass123"
    }
]

username = input("Username: ")
password = input("Password: ")

found = False

for user in users:
    if user["username"] == username and user["password"] == password:
        found = True
        break

if found:
    print("Login Successful")
else:
    print("Invalid Credentials")

print("\nEnd of Lecture 🚀")