# A_D

Interactive browser prep platform based on the supplied NCLEX-PN textbook plus user-supplied NMCN/council past-question and guide files.

## Run

Serve the folder locally with PowerShell:

```powershell
.\serve.ps1
```

Then open [http://localhost:8000](http://localhost:8000).

If PowerShell blocks the script, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

## What Is Included

- Practice mode with instant rationales.
- CBT mode with timer, mixed questions, and final scoring.
- Review dashboard by NCLEX-PN client-needs category.
- Concise study guide from the textbook chapters.
- Multi-answer and single-answer question formats.
- Local progress saving in the browser.
- Generated textbook bank in `src/textbook-bank.js`.
- Repeatable extractor in `scripts/extract_nclex_bank.py`.
- Current extracted bank size: 942 question records with answer keys and rationales.
- Supplemental council bank in `src/supplemental-bank.js`.
- Guide cards in `src/guide-content.js`, separated by textbook strategy, NMCN/council guide, OSCE guide, and subject guide.
- Current supplemental import size: 2,017 question records.
- Current visible CBT bank after clarity filtering: 2,531 question records.
- AI Tutor is served through `/api/chat` so the Gemini key stays on the local server, not in browser code.
- NMCN-style expansion bank in `src/nmcn-saturation-bank.js`.
- Current raw CBT bank: 10,000 question records.
- Current visible CBT bank after clarity filtering: 9,572 question records.
- Practice and CBT position/answers are saved locally so accidental section switches or refreshes preserve progress.

## Content Note

The generated bank is for your local personal study from the PDF you supplied. If you replace the PDF, rerun:

```powershell
& 'C:\Users\A_D\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' .\scripts\extract_nclex_bank.py
```

To rerun the supplemental document import:

```powershell
& 'C:\Users\A_D\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' .\scripts\import_supplemental_materials.py
```
