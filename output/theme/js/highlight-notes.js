// This script enables text highlighting with optional notes and stores them in localStorage

document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector(".article-content");

    if (!content) return;

    // Load existing highlights from localStorage when the page loads
    loadHighlights();

    // Handle mouse selection event
    content.addEventListener("mouseup", function () {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (!selectedText) return;

        // Ask the user to enter a note (optional)
        const note = prompt("Optional note for this highlight:");

        // Create a span element to highlight the selected text
        const highlightSpan = document.createElement("span");
        highlightSpan.className = "highlight-note";
        highlightSpan.textContent = selectedText;
        if (note) highlightSpan.title = note;

        // When clicked, ask the user if they want to remove the highlight
        highlightSpan.addEventListener("click", function () {
            if (confirm("Remove this highlight and note?")) {
                highlightSpan.remove();
                saveHighlights();
            }
        });

        // Replace the selected text with the highlight span
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(highlightSpan);
        selection.removeAllRanges();

        saveHighlights();
    });

    // Save highlights into localStorage
    function saveHighlights() {
        const highlights = [];
        const paragraphs = content.querySelectorAll("p");

        paragraphs.forEach((p, index) => {
            p.querySelectorAll("span.highlight-note").forEach(span => {
                highlights.push({
                    paragraphIndex: index,
                    text: span.textContent,
                    note: span.title || ""
                });
            });
        });

        localStorage.setItem("highlight_notes", JSON.stringify(highlights));
    }

    // Load and reapply highlights from localStorage
    function loadHighlights() {
        const stored = localStorage.getItem("highlight_notes");
        if (!stored) return;

        const highlights = JSON.parse(stored);
        const paragraphs = content.querySelectorAll("p");

        highlights.forEach(item => {
            const p = paragraphs[item.paragraphIndex];
            if (!p) return;

            // Create span for stored highlight
            const span = document.createElement("span");
            span.className = "highlight-note";
            span.textContent = item.text;
            if (item.note) span.title = item.note;

            span.addEventListener("click", function () {
                if (confirm("Remove this highlight and note?")) {
                    span.remove();
                    saveHighlights();
                }
            });

            // Append the highlight to the end of the paragraph (basic version)
            p.appendChild(document.createTextNode(" "));
            p.appendChild(span);
        });
    }
});
