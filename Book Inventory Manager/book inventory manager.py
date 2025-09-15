import os

file_path = 'Library.txt' 


# Adding Book to Library
def add_book():
    try:
        title = input("Enter the book name: ")
        author = input("Enter author name: ") 
        isbn = int(input("Enter ISBN code (numbers only): "))
        price = int(input("Enter the Price (numbers only): "))
        status = input("Current status (Available / Checked Out): ")

        # Ensure the file exists
        if not os.path.exists(file_path):
            open(file_path, "w").close()

        # Append book details to the file
        with open(file_path, "a") as file:
            file.write(f"Title: {title}, Author: {author}, ISBN: {isbn}, Price: {price}, Status: {status}\n")

        print("\n✅ Book added successfully!\n")

    except ValueError:
        print("\n❌ Error: ISBN and Price must be numbers.\n")


# Remove an Book from Library
def remove_book():
    title_to_remove = input("Enter the Book Name to be removed: ").strip().lower()

    if not os.path.exists(file_path):
        print("\n❌ Library file does not exist.\n")
        return

    with open(file_path, "r") as file:
        lines = file.readlines()

    with open(file_path, "w") as file:
        removed = False
        for line in lines:
            if line.lower().startswith(f"title: {title_to_remove}"):
                removed = True
                continue
            file.write(line)

    if removed:
        print(f"\n✅ Book titled '{title_to_remove}' has been removed.\n")
    else:
        print(f"\n⚠️ No book found with title '{title_to_remove}'.\n")


# Searching an book in Library
def search_book():
    search_item=input("Enter the Title or ISBN to search record:").strip().lower()

    if not os.path.exists(file_path):
        print("\n❌ Library file does not exist.\n")
        return
    
    found_books =[]

    with open(file_path,"r") as file:
        lines=file.readlines()
        for line in lines:
            line_lower=line.lower()
            if search_item in line_lower:
                found_books.append(line.strip())
    
    if found_books:
        print("\n✅ Book(s) found:")
        for book in found_books:
            print(book)
    else:
        print(f"\n⚠️ No book found with '{search_term}'.\n")
    

# Generating Report of Available Books
def generate_report():

    if not os.path.exists(file_path):
        print("\n❌ Library file does not exist.\n")
        return

    available_books =[]

    with open(file_path,"r") as file:
        lines = file.readlines()
        for line in lines:
            if "status: available" in line.lower():
                available_books.append(line.strip())

    if available_books:
        print("\n📄 Available Books Report:")
        for book in available_books:
            print(book)
        print(f"\nTotal Available Books: {len(available_books)}\n")
    else:
        print("\n⚠️ No books are currently available.\n")



def main():
    while True:
        print("📚 Library Management System 📚")
        print("1. Add Book")
        print("2. Remove Book")
        print("3. Search Book")
        print("4. Available Books Report")
        print("5. Exit")

        choice = (input("Enter your choice (1-5): ")).strip()

        if choice=="1":
            add_book()
        elif choice=="2":
            remove_book()
        elif choice=="3":
            search_book()
        elif choice=="4":
            generate_report()
        elif choice == "5":
            print("Exiting Library Management System. Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please try again.\n")
if __name__ == "__main__":
    main()