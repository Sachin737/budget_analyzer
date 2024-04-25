dataFile = ['expense-family-discretionary.txt', 'expense-insurance.txt', 'expense-investment-outflows.txt', 'expense-kids-school.txt', 'expense-lifestyle.txt', 'expense-travel.txt', 'expense-vacation.txt', 'expense-vehicle.txt', 'expenses-bills.txt', 'expenses-household.txt', 'expenses-shopping.txt', 'expensses-household-help.txt']


def replaceInFile(f_name, oldVal, newVal):
    with open(f_name, "r") as file:
        content = file.read()
    
    updated_content = content.replace(oldVal, newVal)
    
    with open(f_name, "w") as file:
        file.write(updated_content)

    return print(f"{f_name} | {oldVal} | {newVal}")

for f in dataFile:
    replaceInFile(f, "66217b5dd1ae4f0693f1a4ff", "662a02d135e74805d6f7b119")
