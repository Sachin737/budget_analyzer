import tabula
import pandas as pd

# Read the PDF file
dfs = tabula.read_pdf("https://eaindustry.nic.in/pdf_files/cmonthly.pdf", pages=3)

# Define column names
columns = ['Commodity', 'Rate of Inflation']

# Extract the desired columns
df = dfs[0][['Unnamed: 0', 'Rate of Inflation']]
df.columns = columns  # Rename columns

# Remove the first 7 rows
df = df.iloc[6:]

# Reset index
df.reset_index(drop=True, inplace=True)

# Handle NaN values in the first column
new_rows = []

good = False

for index, row in df.iterrows():
    
    commodity = row['Commodity']
    inflation = row['Rate of Inflation']
    print(commodity,inflation)
    
    if(good):
        good = False
        continue
    
    
    if pd.isna(commodity):  # Check if the commodity is NaN
        if index + 1 < len(df):  # Check if index + 1 is within the range of the DataFrame
            new_rows[-1]['Commodity'] += " " + df.loc[index+1, 'Commodity']  # Append the inflation to the above row's commodity
        new_rows[-1]['Rate of Inflation'] = inflation.split(" ")[1]  # Extract the second value from inflation
        good = True
    else:
         # Extract the second value from inflation
        if (not pd.isna(inflation)):
            new_rows.append({'Commodity': commodity, 'Rate of Inflation': inflation.split(" ")[1]}) 
        else:
            new_rows.append({'Commodity': commodity, 'Rate of Inflation': inflation})

# Create a new DataFrame from the modified rows
df_modified = pd.DataFrame(new_rows)

# Display the modified data
print(df_modified)

# Save the modified DataFrame to a CSV file
df_modified.to_csv('wpi_data.csv', index=False)

