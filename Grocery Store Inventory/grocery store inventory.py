import os
import csv

# CSV file path
filepath = "inventory.csv"
fields = ["Itemname", "Quantity", "Price"]


def create_inventory():
    """Create the inventory CSV if it doesn't exist"""
    if not os.path.exists(filepath):
        with open(filepath, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(fields)

def get_int_input(prompt):
    """Force user to enter an integer"""
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("❌ Invalid input! Please enter a number only.")


def add_item():
    """Add new items to the inventory with validation"""
    with open(filepath, mode="a", newline="") as file:
        writer = csv.writer(file)

        n = get_int_input("How many items you want to include: ")
        for _ in range(n):
            itemname = input("Enter item name: ").strip().capitalize()
            quantity = get_int_input("Enter the quantity: ")
            price = get_int_input("Enter the price: ")
            writer.writerow([itemname, quantity, price])

    print("✅ Stock successfully added to store.")

def sell_stock():
    """Sell items and update inventory"""
    itemname = input("Enter item name to sell: ").strip()
    quantity = get_int_input(f"Enter quantity of {itemname} to sell: ")

    updated = False
    with open(filepath, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)

    header, data = rows[0], rows[1:]
    for row in data:
        if row and row[0].lower() == itemname.lower():
            curr_qty = int(row[1])
            if curr_qty >= quantity:
                row[1] = str(curr_qty - quantity)
                print(f"✅ Sold {quantity} {row[0]}(s). Remaining stock: {row[1]}")
                updated = True
            else:
                print(f"⚠️ Not enough stock! Available: {curr_qty}")
            break

    if updated:
        with open(filepath, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(header)
            writer.writerows(data)
    else:
        print(f"❌ {itemname} not found in inventory.")

def delete_item():
    """Delete an item completely from inventory"""
    itemname = input("Enter item name to delete: ").strip().capitalize()
    with open(filepath, mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)

    header, data = rows[0], rows[1:]
    new_rows = [row for row in data if row and row[0].lower() != itemname.lower()]

    if len(new_rows) == len(data):
        print(f"❌ {itemname} not found in inventory.")
    else:
        with open(filepath, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(header)
            writer.writerows(new_rows)
        print(f"🗑️ {itemname} has been deleted from inventory.")

def view_inventory():
    """Display all items"""
    with open(filepath, mode="r") as file:
        reader = csv.reader(file)
        print("\n📦 Current Inventory:")
        for row in reader:
            print(row)

def low_stock_report():
    """Show items with quantity less than 10"""
    with open(filepath, mode="r") as file:
        reader = csv.DictReader(file)
        low_stock = [row for row in reader if int(row["Quantity"]) < 10]

    if not low_stock:
        print("✅ No low stock items.")
    else:
        print("\n⚠️ Low Stock Items (<10):")
        for row in low_stock:
            print(f"{row['Itemname']} - Quantity: {row['Quantity']}")

def total_stock_value():
    """Calculate total value of inventory"""
    total_value = 0
    with open(filepath, mode="r") as file:
        reader = csv.DictReader(file)
        print("\n💰 Inventory Value Report:")
        for row in reader:
            value = int(row["Quantity"]) * float(row["Price"])
            total_value += value
            print(f"{row['Itemname']} - Qty: {row['Quantity']} × Price: {row['Price']} = ₹{value:.2f}")
    print(f"\nGrand Total Value: ₹{total_value:.2f}")


create_inventory()

while True:
    print("\n=== Grocery Store Menu ===")
    print("1. Add Item")
    print("2. Sell Item")
    print("3. Delete Item")
    print("4. View Inventory")
    print("5. Low Stock Report")
    print("6. Total Stock Value")
    print("7. Exit")

    choice = get_int_input("Enter your choice: ")

    if choice == 1:
        add_item()
    elif choice == 2:
        sell_stock()
    elif choice == 3:
        delete_item()
    elif choice == 4:
        view_inventory()
    elif choice == 5:
        low_stock_report()
    elif choice == 6:
        total_stock_value()
    elif choice == 7:
        print("👋 Exiting program...")
        break
    else:
        print("❌ Invalid choice, try again.")
