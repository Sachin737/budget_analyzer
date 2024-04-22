import pdfplumber
import requests
import io

# URL of the PDF file
pdf_url = 'https://eaindustry.nic.in/pdf_files/cmonthly.pdf'

# Send a GET request to download the PDF
response = requests.get(pdf_url)

# Check if the request was successful
if response.status_code == 200:
    # Open the PDF from the response content
    with io.BytesIO(response.content) as pdf_file:
        with pdfplumber.open(pdf_file) as pdf:
            # Access the third page of the PDF
            page = pdf.pages[2]  # Page index starts from 0

            # Define the bounding box (x0, top, x1, bottom) coordinates
            # (500,130,550,720) -> cordinates for WPI
            # (50,130,200,700) -> cordinates for Commodity name
            
            bbox = (500,130,550,720)

            # Crop the page to the area of interest
            cropped_page = page.within_bbox(bbox)

            # Extract text from the cropped area
            text = cropped_page.extract_text()

            # Now you can process the text to find the Rate of Inflation for Mar-24
            # This might involve parsing the text, using regular expressions, etc.
            print(text)
else:
    print("Failed to retrieve the PDF")

# Note: You will need to determine the correct bounding box coordinates
# for the "Rate of Inflation Mar-24" column on page 3 of your PDF.
