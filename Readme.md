# Prepare website links for Web2Epub

This script tidies link lists for the [Web2EPUB browser extension](https://github.com/dteviot/WebToEpub). 

By default, the extension does not accept a list of plain URLs, but requires them to be formatted as HTML with `<a>` tags and page titles. This is a pain to do manually, so this script automates the process.

## script1.py
Generated by ChatGPT4o 31 Aug 2024. See `requirements.txt` for dependencies.

### Notes:
- The script handles errors when fetching URLs, so if a URL fails, it will print an error message and continue processing the rest.
- The title extraction assumes that the title is present in the `<title>` tag of the HTML. Adjustments may be needed based on the specific structure of the pages you are working with.

## script2.py
Generated by ChatGPT4o 31 Aug 2024. Uses no external dependencies.

### Notes:
- This script uses the built-in `http.client` for making HTTP requests and `html.parser` for parsing HTML. It should work for most simple web pages, but it may not handle all edge cases or complex HTML structures.
- The script assumes that the server supports HTTPS. If you need to handle HTTP URLs, you can modify the connection method accordingly.

## MagicWizardsParser.js
Script to download Magic: the Gathering fiction from the Wizards of the Coast story website, and archived versions thereof. Implemented directly in Web2EPUB. Based off [NoblemtlParser.js](https://github.com/dteviot/WebToEpub/blob/ExperimentalTabMode/plugin/js/parsers/NoblemtlParser.js), add to `Extensions\akiljllkbielkidmammnifcnibaigelm\0.0.0.167_0\js\parsers\` and add `<script src="js/parsers/MagicWizardsParser.js"></script>` to [popup.html](https://github.com/dteviot/WebToEpub/blob/ExperimentalTabMode/plugin/popup.html) (somewhere alphabetical, around line 634). Generated by ChatGPT 4o, with manual adjustments. 

Works for story index pages such as:
- https://web.archive.org/web/20230127170159/https://magic.wizards.com/en/news/magic-story
- https://magic.wizards.com/en/story 

Known issues:
- Does not yet read the Planes/Planeswalkers databank `#databank > a`
- Excludes author names
- Does not crawl paginated indexes beyond the 1st page
- Does not yet work for https://mtglore.com/
- Ignores chapter index thumbnails and chapter summary blurbs (Unfixable?)
- Cover art is stripped of `http:` by [ImageCollector.js](https://github.com/dteviot/WebToEpub/blob/ExperimentalTabMode/plugin/js/ImageCollector.js), which must be manually added for cover art to work
- Uses 1st chapter index thumbnail as cover art, rather than page hero image (not worth fixing? There are no proper book covers provided, best to Photoshop your own)
- New (ca. Q2 2024) articles use WEBP images; these are downloaded, but cannot be rendered. Web2EPUB does not convert WEBP to JPG; this must be done manually
- Twitter embeds (featured heavily in Maro articles) are untested, probably broken. They should be screenshotted manually using https://screenshot.guru/ or equivalent.

Fixed:
~~Sometimes excludes chapter titles~~
- Archive.org inclusion of chapter titles, which are structured as: `<a href="https://web.archive.org/web/20230127170159mp_/https://magic.wizards.com/en/news/magic-story/alone"><h3>Phyrexia: All Will Be One | Alone</h3></a>`
- Wizards live site exclusion of chapter titles, which are structured as:  `<article><div><h3>The Call</h3></div><a href="https://magic.wizards.com/en/news/magic-story/call-2015-04-15"></a></article>`

## Usage:

1. Create `links.txt` which is a list of all the webpages you want in your EPUB, 1 URL per line.
2. Places `links.txt` next to the script.
3. Run `python script2.py` and wait a minute
4. A file called `formatted_links.txt` will be generated, containing the list of all the webpages you provided, formatted as HTML links with page titles.
5. Enter Chapter 1 **Starting URL** into Web2EPUB and click "Load and Analyze", then enter the correct CSS selectors for the page title and content. Then click **Apply**. 
6. Ignore the nonsense that Web2EPUB generates by default. Click **Edit Chapter URLs**. Copypaste the contents of `formatted_links.txt` into Web2EPUB's **Edit Chapter URLs** box.
7. Generate EPUB. 

### Usage notes 
I have noticed that [Chromium versions higher than 90 (approx.) will often default to downloading WEBP images rather than JPEG/PNGs](https://github.com/win32ss/supermium/issues/679). The WEBP image format [is not part of the EPUB2 spec and may have recently (2020) been added to the EPUB3 spec](https://github.com/w3c/epub-specs/issues/1344) and thus will not be loaded by most ereader software. Use old Chromium versions as a workaround, or download images manually using **[Imageye - Image Downloader](https://chromewebstore.google.com/detail/image-downloader-imageye/agionbommeaifngbhincahgmoflcikhm)** (it can scrape original JPEGs or, as a last resort, auto-convert images to JPG). 

[Web2EPUB v0.158](https://github.com/dteviot/WebToEpub/releases/tag/0.0.0.158) seems to be the last version to support older Chromium versions.

Tested with Web2EPUB v0.158, v0.167. As of writing, Web2EPUB does not convert or process images in any way.
