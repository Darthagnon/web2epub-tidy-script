import requests
from bs4 import BeautifulSoup

def fetch_title(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string.strip()  # Get the title from the <title> tag
        return title
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def generate_html_links(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            url = line.strip()
            if url:  # Check if the line is not empty
                title = fetch_title(url)
                if title:
                    # Format the title as needed
                    formatted_title = title.replace(' | ', ' | ')  # Adjust formatting if necessary
                    html_link = f'<a href="{url}">{formatted_title}</a>'
                    outfile.write(html_link + '\n')

if __name__ == "__main__":
    input_file = 'links.txt'  # Input file containing the list of URLs
    output_file = 'formatted_links.txt'  # Output file for the HTML links
    generate_html_links(input_file, output_file)
