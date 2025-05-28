# P&ID Line List Duplicate Highlighter
(AI GENERATED README FILE)
## Overview

This tool helps you manage P&ID line lists by identifying duplicate line numbers. It highlights all duplicate "Line No." entries in green, except for the first occurrence, making it easy to spot repeats in large datasets.

## Features

- Upload a CSV or Excel file with "P&ID No." and "Line No." columns.
- Automatically groups all "Line No." entries under their respective "P&ID No." (even if the P&ID No. is only written once in the file).
- Highlights duplicate "Line No." entries in green, skipping the first occurrence.
- Handles large datasets (1000+ lines) efficiently.

## How to Use

1. **Access the Tool**: Open the tool by clicking the hosted link [Insert Tool URL Here] or by opening index.html in a web browser if running locally.
2. **Upload Your File**: Click the file upload button and select your CSV/Excel file (e.g., "055 LINE LIST.csv").
3. **View Results**: The tool will display a table with "P&ID No." and "Line No." columns. Duplicate "Line No." entries will be highlighted in green, except for the first occurrence.

## File Format

- The file should have two columns: "P&ID No." and "Line No."
- The first row is typically the area name (e.g., "055 LINE LIST") and will be ignored.
- "P&ID No." may be written only once for a group of "Line No." entries—the tool will automatically fill in the blanks.

## Requirements

- A modern web browser (e.g., Chrome, Firefox, Edge).
- No additional software is needed—the tool runs directly in the browser.

## Contact


*Last Updated: May 28, 2025*