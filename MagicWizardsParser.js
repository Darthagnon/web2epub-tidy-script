"use strict";

// Register the parser for magic.wizards.com and archive versions
parserFactory.register("magic.wizards.com", () => new MagicWizardsParser());
parserFactory.register("web.archive.org", () => new MagicWizardsParser()); // For archived versions
parserFactory.registerRule(
    (url, dom) => MagicWizardsParser.isMagicWizardsTheme(dom) * 0.7,
    () => new MagicWizardsParser()
);

class MagicWizardsParser extends Parser {
    constructor() {
        super();
    }

    // Detect if the site matches the expected structure for magic.wizards.com or the archived version
    static isMagicWizardsTheme(dom) {
        // Check if the page is archived
        if (window.location.hostname.includes("web.archive.org")) {
            // Archived page structure typically wraps the original content in #content
            return dom.querySelector("#content article") != null || dom.querySelector("#content .article-content") != null;
        }
        // Regular magic.wizards.com structure
        return dom.querySelector("article") != null || dom.querySelector(".article-content") != null;
    }

    // Extract the list of chapter URLs
    async getChapterUrls(dom) {
        let chapterLinks = [];
        if (window.location.hostname.includes("web.archive.org")) {
            // For archived versions, select the correct container within #content
            chapterLinks = [...dom.querySelectorAll("#content article a, #content .article-content a")];
        } else {
            // For live pages
            chapterLinks = [...dom.querySelectorAll("article a, .article-content a")];
        }
        return chapterLinks.map(this.linkToChapter).reverse();
    }

    // Format chapter links into a standardized structure
    linkToChapter(link) {
        let title = MagicWizardsParser.extractChapterNum(link).trim() + " " + link.textContent.trim();
        return {
            sourceUrl: link.href,
            title: title
        };
    }

    // Extract chapter numbers if available (otherwise use fallback)
    static extractChapterNum(link) {
        let chapterNum = link.querySelector(".chapter_num");
        return chapterNum == null ? link.textContent : chapterNum.textContent;
    }

    // Extract the content of the chapter
    findContent(dom) {
        if (window.location.hostname.includes("web.archive.org")) {
            // For archived pages, the content is often inside #content
            return dom.querySelector("#content .entry-content, #content article, #content .article-content");
        }
        // For live pages
        return dom.querySelector(".entry-content, article, .article-content");
    }

    // Extract the main title of the webpage (article title)
    extractTitleImpl(dom) {
        if (window.location.hostname.includes("web.archive.org")) {
            // For archived pages
            return dom.querySelector("#content h1.entry-title, #content h1.article-title, #content h1") || "Untitled";
        }
        // For live pages
        return dom.querySelector("h1.entry-title, h1.article-title, h1") || "Untitled";
    }

    // Remove unwanted elements (ads, scripts, etc.)
    removeUnwantedElementsFromContentElement(element) {
        let toRemove = [...element.querySelectorAll("p")]
            .filter(p => p.style.opacity === "0");
        util.removeElements(toRemove);
        util.removeElements(this.findEmptySpanElements(element));
        util.removeChildElementsMatchingCss(element, "span.modern-footnotes-footnote__note");
        util.removeChildElementsMatchingCss(element, "span.footnote_tooltip");
        util.removeChildElementsMatchingCss(element, "div#hpk");
        super.removeUnwantedElementsFromContentElement(element);
    }

    // Find and remove empty <span> elements
    findEmptySpanElements(element) {
        return [...element.querySelectorAll("span")].filter(s => !s.firstChild);
    }

    // Find the chapter title (uses webpage title if specific one isn't found)
    findChapterTitle(dom, webPage) {
        return webPage.title;
    }

    // Build a comprehensive chapter title from multiple elements (if necessary)
    static buildChapterTitle(dom) {
        let title = "";
        let addText = (selector) => {
            let element = dom.querySelector(selector);
            if (element != null) {
                title += " " + element.textContent;
            }
        };
        addText("h1.entry-title");
        addText(".cat-series");
        return title;
    }

    // Find the cover image for the chapter/book
    findCoverImageUrl(dom) {
        if (window.location.hostname.includes("web.archive.org")) {
            // For archived pages, images might be wrapped in the #content container
            return util.getFirstImgSrc(dom, "#content .article-cover img, #content .thumbook, #content .sertothumb");
        }
        // For live pages
        return util.getFirstImgSrc(dom, ".article-cover img, .thumbook, .sertothumb");
    }

    // Preprocess the DOM to remove unnecessary elements (cleaning the page)
    preprocessRawDom(webPageDom) {
        util.removeChildElementsMatchingCss(webPageDom, "div.saboxplugin-wrap, div.code-block");
    }

    // Get additional information for the EPUB (optional metadata)
    getInformationEpubItemChildNodes(dom) {
        let info = dom.querySelector("div.synp .entry-content, div.sersys.entry-content");
        return info == null ? [] : [info];
    }
}
