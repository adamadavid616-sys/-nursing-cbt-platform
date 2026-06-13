import json
import re
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
PDF = Path("C:/Users/A_D/Downloads/NCLEX bookzz (1).pdf")
OUT = ROOT / "src" / "textbook-bank.js"


SECTIONS = [
    ("Essential Concepts", 24, 29),
    ("Cardiovascular System", 32, 39),
    ("Hematologic System", 40, 45),
    ("Respiratory System", 46, 51),
    ("Neurosensory System", 52, 57),
    ("Gastrointestinal System", 58, 65),
    ("Genitourinary System", 66, 73),
    ("Musculoskeletal System", 74, 79),
    ("Endocrine System", 80, 85),
    ("Integumentary System", 86, 89),
    ("Maternity and Newborns", 92, 115),
    ("Pediatrics", 116, 141),
    ("Older Adult Client", 144, 147),
    ("Mental Health Client", 148, 157),
    ("Perioperative Client", 158, 161),
    ("Cancer", 162, 167),
    ("Nutrition and Special Diets", 170, 175),
    ("Pharmacology", 176, 185),
    ("Practice Test One", 188, 212),
    ("Practice Test Two", 214, 237),
    ("Practice Test Three", 238, 261),
    ("Practice Test Four", 262, 287),
    ("Practice Test Five", 288, 313),
    ("Practice Test Six", 314, 337),
    ("Practice Test Seven", 338, 363),
    ("Practice Test Eight", 364, 391),
]


def clean_layout_line(raw):
    line = raw.strip()
    if not line:
        return ""
    if re.search(r"Copyright 2010 Cengage", line):
        return ""
    if re.match(r"^\s*(CHAPTER|UNIT|Practice Test)\b", line):
        return ""
    if re.match(r"^\s*\d+\s+(UNIT|CHAPTER|Practice Test)", line):
        return ""
    return line


def split_layout_columns(text):
    left, right = [], []
    for raw in text.splitlines():
        if not raw.strip():
            continue
        lpart = clean_layout_line(raw[:86])
        rpart = clean_layout_line(raw[86:])
        if lpart:
            left.append(lpart)
        if rpart:
            right.append(rpart)
    return "\n".join(left + right)


def visitor_columns_text(page):
    fragments = []

    def visitor(text, cm, tm, font_dict, font_size):
        x, y = tm[4], tm[5]
        for raw in text.splitlines():
            line = clean_layout_line(raw)
            if line:
                fragments.append((x, y, line))

    page.extract_text(visitor_text=visitor)
    left = [(y, x, line) for x, y, line in fragments if x < 310]
    right = [(y, x, line) for x, y, line in fragments if x >= 310]

    def ordered(items):
        return [line for y, x, line in sorted(items, key=lambda item: (-item[0], item[1]))]

    return "\n".join(ordered(left) + ordered(right))


def clean_plain_text(text):
    cleaned = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if re.search(r"Copyright 2010 Cengage", line):
            continue
        if re.match(r"^\d+\s+(UNIT|CHAPTER)", line):
            continue
        if re.match(r"^(CHAPTER|UNIT)\b", line):
            continue
        if line in {"ANSWER RATIONALE NP CN CL SA", "ANSWER RATIONALE"}:
            continue
        cleaned.append(line)
    return "\n".join(cleaned)


def section_text(reader, start_page, end_page, layout=False):
    pages = []
    for page_no in range(start_page - 1, end_page):
        if layout:
            pages.append(visitor_columns_text(reader.pages[page_no]))
        else:
            text = reader.pages[page_no].extract_text() or ""
            pages.append(clean_plain_text(text))
    return "\n".join(pages)


def fixed_section_text(reader, start_page, end_page):
    pages = []
    for page_no in range(start_page - 1, end_page):
        text = reader.pages[page_no].extract_text(extraction_mode="layout") or ""
        pages.append(split_layout_columns(text))
    return "\n".join(pages)


def remove_front_matter(text):
    text = re.sub(r"(?is)^.*?SAMPLE QUESTIONS", "", text)
    text = re.sub(r"(?is)^.*?Practice Test (One|Two|Three|Four|Five|Six|Seven|Eight)", "", text)
    return text


def parse_question_blocks(text):
    blocks, current, expected = [], None, 1
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.upper().startswith("ANSWERS AND RATIONALES"):
            break
        m = re.match(r"^(\d{1,3})\.(?:\s+(.*))?$", line)
        if m and int(m.group(1)) == expected:
            if current:
                blocks.append(current)
            first_line = (m.group(2) or "").strip()
            current = {"number": expected, "lines": [first_line] if first_line else []}
            expected += 1
        elif current:
            current["lines"].append(line)
    if current:
        blocks.append(current)
    return blocks


def split_prompt_options(lines):
    prompt, options, current = [], [], None
    for line in lines:
        m = re.match(r"^([1-8])\.(?:\s+(.*))?$", line)
        if m:
            if current is not None:
                options.append(current.strip())
            current = (m.group(2) or "").strip()
        elif current is None:
            prompt.append(line)
        else:
            current += " " + line
    if current is not None:
        options.append(current.strip())
    return normalize(" ".join(prompt)), [normalize(option) for option in options]


def parse_chapter_answers(text):
    after = re.split(r"ANSWERS AND RATIONALES", text, flags=re.I)
    if len(after) < 2:
        return {}
    answer_text = after[-1]
    starts = list(re.finditer(r"(?m)^(\d{1,3})\.\s+([\d,\s]+)\.?\s+", answer_text))
    blocks = []
    for index, match in enumerate(starts):
        end = starts[index + 1].start() if index + 1 < len(starts) else len(answer_text)
        blocks.append(
            {
                "number": int(match.group(1)),
                "text": match.group(2).strip() + " " + answer_text[match.end() : end].strip(),
            }
        )
    answers = {}
    for block in blocks:
        m = re.match(r"^([\d,\s]+)\.?\s+(.*)", block["text"])
        if not m:
            continue
        answers[block["number"]] = {
            "answer": answer_indexes(m.group(1)),
            "rationale": normalize(m.group(2)),
        }
    return answers


def parse_practice_answers(text):
    answer_text = text
    if "ANSWER RATIONALE" in text:
        answer_text = text.split("ANSWER RATIONALE", 1)[1]
    blocks, current = [], None
    for line in answer_text.splitlines():
        line = line.strip()
        if not line:
            continue
        m = re.match(r"^#\s*(\d{1,3})\.\s*(.*)", line)
        if m:
            if current:
                blocks.append(current)
            current = {"number": int(m.group(1)), "text": m.group(2).strip()}
        elif current:
            current["text"] += "\n" + line
    if current:
        blocks.append(current)

    answers = {}
    for block in blocks:
        text = re.sub(r"\n?(Ad|Dc|Im)\s+[A-Za-z]+/\d+\s+[A-Za-z]+\s+\d+\s*$", "", block["text"]).strip()
        m = re.match(r"^([\d,\s]+)(.*)", text, flags=re.S)
        if not m:
            continue
        digits = m.group(1)
        rationale = m.group(2).strip()
        answers[block["number"]] = {
            "answer": answer_indexes(digits),
            "rationale": normalize(rationale),
        }
    return answers


def answer_indexes(text):
    return [int(n) - 1 for n in re.findall(r"\d+", text) if 1 <= int(n) <= 8]


def normalize(text):
    replacements = {
        "  ": " ",
        "  rst": "first",
        " rst": " first",
        "identi  ed": "identified",
        "identi  cation": "identification",
        "de  cient": "deficient",
        "in ammation": "inflammation",
        " uid": " fluid",
        " eld": " field",
        " oor": " floor",
        " brillation": "fibrillation",
        " rst": " first",
    }
    text = re.sub(r"\s+", " ", text).strip()
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def category_for(source, prompt):
    blob = f"{source} {prompt}".lower()
    if any(word in blob for word in ["delegate", "assignment", "consent", "confidential", "advance directive", "legal", "ethical", "reporting"]):
        return "Coordinated Care"
    if any(word in blob for word in ["infection", "isolation", "hand washing", "safety", "fall", "restraint", "sterile", "seizure"]):
        return "Safety and Infection Prevention and Control"
    if any(word in blob for word in ["pregnan", "newborn", "child", "infant", "toddler", "development", "immunization", "diet"]):
        return "Health Promotion and Maintenance"
    if any(word in blob for word in ["psychiatric", "depressed", "anxiety", "suicide", "hallucination", "alcohol", "grief", "therapeutic"]):
        return "Psychosocial Integrity"
    if any(word in blob for word in ["hygiene", "comfort", "pain", "nutrition", "bath", "elimination", "mobility"]):
        return "Basic Care and Comfort"
    if any(word in blob for word in ["medication", "drug", "digoxin", "heparin", "warfarin", "insulin", "antibiotic", "dose", "injection"]):
        return "Pharmacological Therapies"
    if any(word in blob for word in ["laboratory", "procedure", "catheterization", "preoperative", "postoperative", "diagnostic", "vital signs"]):
        return "Reduction of Risk Potential"
    return "Physiological Adaptation"


def build_bank():
    reader = PdfReader(str(PDF))
    all_items = []
    for source, start, end in SECTIONS:
        layout = section_text(reader, start, end, layout=True)
        plain = section_text(reader, start, end, layout=False)
        if source.startswith("Practice Test"):
            question_area = layout.split("ANSWER")[0]
        else:
            question_area = remove_front_matter(layout.split("ANSWERS AND RATIONALES")[0])
        questions = parse_question_blocks(question_area)
        answers = parse_practice_answers(plain) if source.startswith("Practice Test") else parse_chapter_answers(plain)

        for block in questions:
            prompt, options = split_prompt_options(block["lines"])
            answer = answers.get(block["number"], {})
            if not prompt or len(options) < 2 or not answer.get("answer"):
                continue
            all_items.append(
                {
                    "id": f"{slug(source)}-{block['number']}",
                    "source": source,
                    "chapter": source,
                    "category": category_for(source, prompt),
                    "type": "multi" if len(answer["answer"]) > 1 else "single",
                    "number": block["number"],
                    "prompt": prompt,
                    "options": options,
                    "answer": answer["answer"],
                    "rationale": answer["rationale"],
                }
            )
    return all_items


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def main():
    items = build_bank()
    payload = json.dumps(items, ensure_ascii=False, indent=2)
    OUT.write_text(
        "/* Generated from the local NCLEX-PN PDF supplied by the user. */\n"
        f"export const textbookQuestions = {payload};\n",
        encoding="utf-8",
    )
    summary = {}
    for item in items:
        summary[item["source"]] = summary.get(item["source"], 0) + 1
    print(json.dumps({"total": len(items), "by_source": summary}, indent=2))


if __name__ == "__main__":
    main()
