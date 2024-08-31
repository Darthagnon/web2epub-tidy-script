import http.client
import urllib.parse
from html.parser import HTMLParser

class TitleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data

def fetch_title(url):
    parsed_url = urllib.parse.urlparse(url)
    conn = http.client.HTTPSConnection(parsed_url.netloc)
    
    try:
        conn.request("GET", parsed_url.path or "/")
        response = conn.getresponse()
        
        if response.status == 200:
            html_content = response.read().decode('utf-8')
            parser = TitleParser()
            parser.feed(html_content)
            return parser.title.strip()
        else:
            print(f"Error fetching {url}: Status code {response.status}")
            return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None
    finally:
        conn.close()

def generate_html_links(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            url = line.strip()
            if url:  # Check if the line is not empty
                title = fetch_title(url)
                if title:
                    html_link = f'<a href="{url}">{title}</a>'
                    outfile.write(html_link + '\n')

if __name__ == "__main__":
    input_file = 'links.txt'  # Input file containing the list of URLs
    output_file = 'formatted_links.txt'  # Output file for the HTML links
    generate_html_links(input_file, output_file)
