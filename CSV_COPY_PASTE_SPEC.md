## 8. Copy-paste CSV

- Paste comma-separated names into the input to detect multiple attendees. Supports simple format (`Jordan Alvarez, Alexandra Chen`) and Google Calendar format (`Alex Blue <a.blue@rippling.com>`), extracting names from both.
- When CSV is detected, the dropdown shows **Add {count} attendees** with the message "Multiple attendees detected. We'll add them or create new attendees". Press Enter or click to process all at once.
- For each name, performs case-insensitive database lookup. If found, uses the existing person; if not found, creates a custom attendee. All attendees are added in a single batch operation.
- Duplicate names are automatically deduplicated, already-selected people are filtered out, and empty entries are ignored.
