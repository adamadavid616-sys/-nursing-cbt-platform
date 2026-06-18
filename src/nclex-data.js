export const blueprint = [
  ["Coordinated Care", "18-24%", "Prioritization, delegation, legal/ethical care, advocacy, referrals, consent, documentation."],
  ["Safety and Infection Prevention and Control", "10-16%", "Standard precautions, isolation, fall prevention, sterile technique, emergency response, restraints."],
  ["Health Promotion and Maintenance", "6-12%", "Growth and development, screening, pregnancy, newborn care, prevention teaching."],
  ["Psychosocial Integrity", "9-15%", "Therapeutic communication, coping, mental health, grief, crisis, substance use, abuse/neglect."],
  ["Basic Care and Comfort", "7-13%", "Mobility, nutrition, elimination, hygiene, comfort, sleep, assistive devices."],
  ["Pharmacological Therapies", "10-16%", "Medication administration, expected effects, adverse effects, IV therapy, dosage safety."],
  ["Reduction of Risk Potential", "9-15%", "Labs, diagnostics, procedure preparation, complications, vital signs, monitoring."],
  ["Physiological Adaptation", "7-13%", "Acute/chronic illness, fluid/electrolytes, hemodynamics, emergencies, pathophysiology."]
];

export const studyGuide = [
  {
    title: "Test-taking priorities",
    points: "Identify the client, the time frame, and the key word. For first action, assess unless there is an immediate threat to airway, breathing, circulation, safety, or infection control."
  },
  {
    title: "Medical-surgical systems",
    points: "Master common signs, complications, nursing actions, and teaching for cardiovascular, respiratory, neurologic, GI, GU, endocrine, integumentary, hematologic, and musculoskeletal disorders."
  },
  {
    title: "Maternity, newborn, and pediatrics",
    points: "Focus on normal versus danger findings, growth milestones, immunization logic, pregnancy complications, postpartum hemorrhage, newborn thermoregulation, and family teaching."
  },
  {
    title: "Special populations",
    points: "Prepare for older adult safety, mental health communication, perioperative care, oncology precautions, nutrition therapy, and culturally respectful care."
  },
  {
    title: "Pharmacology",
    points: "Learn drug classes by effect, major adverse reactions, contraindications, high-alert medication checks, client teaching, and when to notify the provider."
  },
  {
    title: "NGN clinical judgment",
    points: "Practice the six steps: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes."
  }
];

export const questions = [
  {
    id: 1,
    chapter: "How to Prepare for NCLEX-PN",
    category: "Coordinated Care",
    type: "single",
    prompt: "A client with dementia is admitted to long-term care. The client's adult child says, \"I feel guilty leaving my parent here.\" Which response best opens therapeutic communication?",
    options: [
      "You made the correct decision because care is difficult at home.",
      "Tell me what worries you most about this change.",
      "The staff here will make sure nothing goes wrong.",
      "You should visit every day until the guilt goes away."
    ],
    answer: [1],
    rationale: "The best response invites expression and explores feelings. Reassurance and advice can close communication before the concern is understood."
  },
  {
    id: 2,
    chapter: "Essential Concepts",
    category: "Safety and Infection Prevention and Control",
    type: "single",
    prompt: "Which action has the highest priority before assisting any client with direct care?",
    options: ["Verify the diet order.", "Perform hand hygiene.", "Raise the head of the bed.", "Check the pain score."],
    answer: [1],
    rationale: "Hand hygiene is the first-line safety action to reduce transmission of microorganisms before client contact."
  },
  {
    id: 3,
    chapter: "Cardiovascular System",
    category: "Physiological Adaptation",
    type: "single",
    prompt: "A client reports crushing chest pain, diaphoresis, and nausea. Which nursing action is most urgent?",
    options: ["Encourage slow ambulation.", "Place the client supine with legs elevated.", "Notify the RN/provider and obtain vital signs.", "Offer a full meal to reduce nausea."],
    answer: [2],
    rationale: "These cues suggest myocardial ischemia. Rapid assessment, vital signs, and escalation are urgent; activity and meals increase cardiac workload or aspiration risk."
  },
  {
    id: 4,
    chapter: "Hematologic System",
    category: "Reduction of Risk Potential",
    type: "single",
    prompt: "Which laboratory value should the practical nurse report before an invasive bedside procedure?",
    options: ["Platelets 42,000/mm3", "Hemoglobin 13.8 g/dL", "Sodium 138 mEq/L", "WBC 7,800/mm3"],
    answer: [0],
    rationale: "Severe thrombocytopenia increases bleeding risk and should be reported before invasive procedures."
  },
  {
    id: 5,
    chapter: "Respiratory System",
    category: "Physiological Adaptation",
    type: "single",
    prompt: "A client with COPD is short of breath and has an oxygen saturation of 88%. Which position should the nurse assist the client to assume first?",
    options: ["Flat with one pillow", "Side-lying left", "High Fowler's with arms supported", "Trendelenburg"],
    answer: [2],
    rationale: "High Fowler's and arm support improve chest expansion and accessory muscle use. The nurse should also follow the oxygen prescription and report worsening status."
  },
  {
    id: 6,
    chapter: "Neurosensory System",
    category: "Reduction of Risk Potential",
    type: "single",
    prompt: "Which finding after a head injury requires immediate reporting?",
    options: ["Mild headache", "Unequal pupils", "Client asks for family", "Small scalp abrasion"],
    answer: [1],
    rationale: "Unequal pupils may indicate increased intracranial pressure or neurologic deterioration."
  },
  {
    id: 7,
    chapter: "Gastrointestinal System",
    category: "Basic Care and Comfort",
    type: "single",
    prompt: "A client with a new colostomy refuses to look at the stoma. Which nursing action is best?",
    options: ["Change the pouch quickly and avoid discussion.", "Tell the client the stoma is not difficult to manage.", "Offer step-by-step involvement when the client is ready.", "Insist the client watch every pouch change."],
    answer: [2],
    rationale: "Gradual participation supports coping and learning while respecting readiness."
  },
  {
    id: 8,
    chapter: "Genitourinary System",
    category: "Safety and Infection Prevention and Control",
    type: "single",
    prompt: "Which action helps prevent catheter-associated urinary tract infection?",
    options: ["Keep the drainage bag below bladder level.", "Disconnect the tubing for ambulation.", "Irrigate the catheter each shift.", "Tape the bag to the side rail."],
    answer: [0],
    rationale: "Keeping the bag below bladder level promotes drainage and prevents backflow. Closed drainage should be maintained."
  },
  {
    id: 9,
    chapter: "Musculoskeletal System",
    category: "Reduction of Risk Potential",
    type: "single",
    prompt: "A client with a new cast reports increasing pain unrelieved by medication and numb toes. What should the nurse do?",
    options: ["Elevate the limb and recheck in four hours.", "Report the findings immediately.", "Apply heat over the cast.", "Encourage active weight bearing."],
    answer: [1],
    rationale: "Increasing pain and numbness can signal neurovascular compromise or compartment syndrome and require immediate escalation."
  },
  {
    id: 10,
    chapter: "Endocrine System",
    category: "Physiological Adaptation",
    type: "single",
    prompt: "A client with diabetes is shaky, sweaty, and confused. What is the priority action if the client can swallow?",
    options: ["Give a rapid-acting carbohydrate.", "Hold all oral intake.", "Administer long-acting insulin.", "Place the client in a dark room."],
    answer: [0],
    rationale: "Symptoms suggest hypoglycemia. If conscious and able to swallow, give rapid carbohydrate and recheck glucose per policy."
  },
  {
    id: 11,
    chapter: "Integumentary System",
    category: "Basic Care and Comfort",
    type: "multi",
    prompt: "Which measures help prevent pressure injury for an immobile client? Select all that apply.",
    options: ["Reposition at scheduled intervals.", "Keep skin clean and dry.", "Massage reddened bony prominences.", "Use pillows to offload heels.", "Encourage adequate protein and fluids if allowed."],
    answer: [0, 1, 3, 4],
    rationale: "Repositioning, moisture control, heel offloading, and nutrition reduce risk. Reddened areas should not be massaged because tissue damage may worsen."
  },
  {
    id: 12,
    chapter: "Maternity and Newborns",
    category: "Health Promotion and Maintenance",
    type: "single",
    prompt: "Which postpartum finding requires immediate follow-up?",
    options: ["Fundus firm at the umbilicus", "Moderate rubra lochia", "Saturating a pad in 15 minutes", "Mild afterpains with breastfeeding"],
    answer: [2],
    rationale: "Rapid pad saturation suggests postpartum hemorrhage. A firm fundus and moderate rubra can be expected early postpartum."
  },
  {
    id: 13,
    chapter: "Pediatrics",
    category: "Health Promotion and Maintenance",
    type: "single",
    prompt: "Which toy is most appropriate for a hospitalized toddler?",
    options: ["Small beads", "A push-pull toy", "A complex board game", "A glass thermometer to hold"],
    answer: [1],
    rationale: "Toddlers enjoy gross motor and cause-effect play. Small objects and glass items create safety hazards."
  },
  {
    id: 14,
    chapter: "Older Adult Client",
    category: "Safety and Infection Prevention and Control",
    type: "multi",
    prompt: "Which interventions reduce fall risk for an older adult? Select all that apply.",
    options: ["Keep the call light within reach.", "Use non-skid footwear.", "Leave clutter near the bed for convenience.", "Review dizziness after new medications.", "Keep the bed in the lowest position."],
    answer: [0, 1, 3, 4],
    rationale: "Call-light access, non-skid footwear, medication awareness, and low bed position support safety. Clutter increases risk."
  },
  {
    id: 15,
    chapter: "Mental Health Client",
    category: "Psychosocial Integrity",
    type: "single",
    prompt: "A client says, \"I hear voices telling me I am worthless.\" Which response is best?",
    options: ["I do not hear the voices, but I can see this is frightening.", "Those voices are not real, so ignore them.", "Why would the voices say that?", "You should pray until the voices stop."],
    answer: [0],
    rationale: "The nurse acknowledges the client's experience without validating the hallucination and supports safety and reality orientation."
  },
  {
    id: 16,
    chapter: "Perioperative Client",
    category: "Reduction of Risk Potential",
    type: "single",
    prompt: "Which preoperative finding should be reported before surgery?",
    options: ["Signed consent in the chart", "Client states an allergy to latex", "Client voided before transport", "NPO status since midnight"],
    answer: [1],
    rationale: "Latex allergy requires specific precautions to prevent an allergic reaction in the operating environment."
  },
  {
    id: 17,
    chapter: "Cancer",
    category: "Physiological Adaptation",
    type: "single",
    prompt: "A client receiving chemotherapy has a temperature of 38.3 C (101 F). What is the priority?",
    options: ["Offer a warm blanket.", "Report the fever promptly.", "Encourage visitors.", "Give fresh flowers for comfort."],
    answer: [1],
    rationale: "Fever during chemotherapy may indicate infection during neutropenia and requires prompt reporting."
  },
  {
    id: 18,
    chapter: "Nutrition and Special Diets",
    category: "Basic Care and Comfort",
    type: "single",
    prompt: "Which food choice best fits a low-sodium diet?",
    options: ["Canned soup", "Smoked sausage", "Fresh baked chicken without added salt", "Pickled vegetables"],
    answer: [2],
    rationale: "Fresh, unprocessed foods prepared without added salt are generally lower in sodium than canned, smoked, or pickled foods."
  },
  {
    id: 19,
    chapter: "Pharmacology",
    category: "Pharmacological Therapies",
    type: "single",
    prompt: "Before giving digoxin, which assessment is most important?",
    options: ["Apical pulse", "Skin turgor", "Bowel sounds", "Pupil response"],
    answer: [0],
    rationale: "Digoxin can slow heart rate. The apical pulse should be checked and the medication held/reported according to ordered parameters."
  },
  {
    id: 20,
    chapter: "Pharmacology",
    category: "Pharmacological Therapies",
    type: "multi",
    prompt: "Which medication rights should be checked before administration? Select all that apply.",
    options: ["Right client", "Right medication", "Right favorite color", "Right dose", "Right route"],
    answer: [0, 1, 3, 4],
    rationale: "Core medication rights include client, medication, dose, route, time, documentation, reason, response, and education depending on policy."
  },
  {
    id: 21,
    chapter: "Cardiovascular System",
    category: "Pharmacological Therapies",
    type: "single",
    prompt: "A client taking warfarin reports black, tarry stools. Which action is priority?",
    options: ["Document as expected.", "Report possible bleeding.", "Teach the client to increase spinach intake.", "Give the next dose early."],
    answer: [1],
    rationale: "Black, tarry stools may indicate gastrointestinal bleeding, a serious anticoagulant complication."
  },
  {
    id: 22,
    chapter: "Respiratory System",
    category: "Safety and Infection Prevention and Control",
    type: "single",
    prompt: "Which client should be placed on airborne precautions?",
    options: ["Client with pulmonary tuberculosis", "Client with draining wound MRSA", "Client with urinary tract infection", "Client with bacterial conjunctivitis"],
    answer: [0],
    rationale: "Pulmonary tuberculosis requires airborne precautions. MRSA wound drainage commonly requires contact precautions."
  },
  {
    id: 23,
    chapter: "Gastrointestinal System",
    category: "Reduction of Risk Potential",
    type: "single",
    prompt: "A client with cirrhosis becomes increasingly confused and has asterixis. Which complication is suspected?",
    options: ["Hepatic encephalopathy", "Appendicitis", "Hypothyroidism", "Bowel obstruction"],
    answer: [0],
    rationale: "Confusion and asterixis in cirrhosis are classic cues for hepatic encephalopathy."
  },
  {
    id: 24,
    chapter: "Genitourinary System",
    category: "Physiological Adaptation",
    type: "single",
    prompt: "Which finding in a client with chronic kidney disease should be reported?",
    options: ["Potassium 6.1 mEq/L", "Hemoglobin 11 g/dL", "Mild fatigue", "Decreased appetite"],
    answer: [0],
    rationale: "Hyperkalemia can cause life-threatening dysrhythmias and requires prompt reporting."
  },
  {
    id: 25,
    chapter: "Maternity and Newborns",
    category: "Reduction of Risk Potential",
    type: "single",
    prompt: "A pregnant client reports severe headache, blurred vision, and epigastric pain. What should the nurse suspect?",
    options: ["Normal third-trimester discomfort", "Preeclampsia with severe features", "Braxton Hicks contractions", "Urinary frequency"],
    answer: [1],
    rationale: "Headache, visual changes, and epigastric pain are danger signs associated with severe preeclampsia."
  },
  {
    id: 26,
    chapter: "Pediatrics",
    category: "Physiological Adaptation",
    type: "single",
    prompt: "A child with asthma has severe retractions and cannot speak in full sentences. What is the priority?",
    options: ["Begin discharge teaching.", "Report respiratory distress and follow rescue therapy orders.", "Offer a large meal.", "Encourage quiet reading only."],
    answer: [1],
    rationale: "Severe work of breathing and inability to speak are signs of significant respiratory distress requiring rapid intervention."
  },
  {
    id: 27,
    chapter: "Mental Health Client",
    category: "Psychosocial Integrity",
    type: "single",
    prompt: "Which client statement requires the most immediate action?",
    options: ["I feel sad most mornings.", "I plan to take all my pills tonight.", "I do not enjoy television anymore.", "I have trouble sleeping."],
    answer: [1],
    rationale: "A specific suicidal plan requires immediate safety precautions and escalation."
  },
  {
    id: 28,
    chapter: "Coordinated Care",
    category: "Coordinated Care",
    type: "single",
    prompt: "Which task is appropriate to assign to experienced assistive personnel?",
    options: ["Evaluate chest pain.", "Teach insulin self-injection.", "Ambulate a stable postoperative client as directed.", "Assess a new pressure injury."],
    answer: [2],
    rationale: "Stable, routine tasks may be assigned. Assessment, teaching, and evaluation remain nursing responsibilities."
  },
  {
    id: 29,
    chapter: "Endocrine System",
    category: "Health Promotion and Maintenance",
    type: "single",
    prompt: "Which teaching is most important for a client starting levothyroxine?",
    options: ["Take it at the same time each morning.", "Stop it when symptoms improve.", "Expect drowsiness after each dose.", "Double the dose after missed doses."],
    answer: [0],
    rationale: "Consistent daily dosing supports stable thyroid levels. Therapy is usually long-term and should not be stopped abruptly."
  },
  {
    id: 30,
    chapter: "Integumentary System",
    category: "Physiological Adaptation",
    type: "single",
    prompt: "For a major burn client, which early complication is the priority concern?",
    options: ["Fluid volume deficit", "Improved appetite", "Mild itching", "Increased sleep"],
    answer: [0],
    rationale: "Major burns cause capillary leak and large fluid shifts, making hypovolemia and shock early priorities."
  },
  {
    id: 31,
    chapter: "Nutrition and Special Diets",
    category: "Health Promotion and Maintenance",
    type: "single",
    prompt: "Which instruction supports aspiration prevention for a client with dysphagia?",
    options: ["Drink thin liquids quickly.", "Sit upright during meals.", "Lie flat after eating.", "Use a straw for every sip."],
    answer: [1],
    rationale: "Upright positioning decreases aspiration risk. Liquid consistency and straw use should follow the swallow plan."
  },
  {
    id: 32,
    chapter: "Essential Concepts",
    category: "Coordinated Care",
    type: "single",
    prompt: "The nurse receives four requests. Which should be addressed first?",
    options: ["Client requesting a blanket", "Client with new shortness of breath", "Client asking about visiting hours", "Client ready for routine bath"],
    answer: [1],
    rationale: "Airway and breathing concerns take priority over comfort and routine requests."
  },
  {
    id: 33,
    chapter: "Pharmacology",
    category: "Pharmacological Therapies",
    type: "single",
    prompt: "Which client teaching is correct for nitroglycerin tablets?",
    options: ["Store tablets in a clear weekly pill box.", "Sit or lie down before taking a dose.", "Take only with milk.", "Use for any abdominal pain."],
    answer: [1],
    rationale: "Nitroglycerin can cause hypotension and dizziness, so the client should sit or lie down. It should be stored in its original dark container."
  },
  {
    id: 34,
    chapter: "Older Adult Client",
    category: "Psychosocial Integrity",
    type: "single",
    prompt: "An older adult says, \"Everyone talks to my daughter instead of me.\" Which action supports dignity?",
    options: ["Continue speaking to the daughter because it is faster.", "Ask the client directly about preferences and decisions.", "Tell the client not to worry.", "Avoid eye contact to reduce pressure."],
    answer: [1],
    rationale: "Directly involving the client respects autonomy unless the client lacks decision-making capacity."
  },
  {
    id: 35,
    chapter: "Perioperative Client",
    category: "Basic Care and Comfort",
    type: "single",
    prompt: "Which action helps prevent postoperative atelectasis?",
    options: ["Deep breathing and coughing as prescribed", "Limiting all movement for 48 hours", "Drinking carbonated beverages only", "Keeping the room dark"],
    answer: [0],
    rationale: "Deep breathing, coughing, incentive spirometry, and early mobility help expand alveoli."
  },
  {
    id: 36,
    chapter: "Cancer",
    category: "Safety and Infection Prevention and Control",
    type: "multi",
    prompt: "Which precautions are appropriate for a client with neutropenia? Select all that apply.",
    options: ["Perform hand hygiene before care.", "Avoid fresh flowers in the room.", "Screen visitors for illness.", "Use rectal temperatures daily.", "Report fever promptly."],
    answer: [0, 1, 2, 4],
    rationale: "Infection prevention is essential. Rectal temperatures should be avoided because they can injure mucosa and introduce organisms."
  },
  {
    id: 37,
    chapter: "Respiratory System",
    category: "Reduction of Risk Potential",
    type: "single",
    prompt: "Which cue best indicates ineffective airway clearance?",
    options: ["Clear speech", "Productive cough with coarse crackles", "Pink nail beds", "Regular pulse"],
    answer: [1],
    rationale: "Coarse crackles and retained secretions suggest airway clearance problems requiring intervention."
  },
  {
    id: 38,
    chapter: "Cardiovascular System",
    category: "Basic Care and Comfort",
    type: "single",
    prompt: "Which measure helps reduce edema in a client with heart failure?",
    options: ["Elevate the legs if not contraindicated.", "Encourage high-sodium snacks.", "Keep the client flat all day.", "Restrict all movement permanently."],
    answer: [0],
    rationale: "Leg elevation can promote venous return and reduce dependent edema. Sodium restriction and ordered activity balance are also common."
  },
  {
    id: 39,
    chapter: "Pediatrics",
    category: "Safety and Infection Prevention and Control",
    type: "single",
    prompt: "Which action is most important when giving oral medication to an infant?",
    options: ["Mix it in a full bottle of formula.", "Use an oral syringe and give small amounts along the cheek.", "Place the infant flat.", "Pinch the nose until swallowed."],
    answer: [1],
    rationale: "An oral syringe along the cheek supports safer swallowing. Mixing in a full bottle risks incomplete dosing."
  },
  {
    id: 40,
    chapter: "Maternity and Newborns",
    category: "Basic Care and Comfort",
    type: "single",
    prompt: "Which action helps prevent newborn heat loss immediately after birth?",
    options: ["Place the newborn under a fan.", "Dry the newborn thoroughly and use warm blankets.", "Delay drying until after weighing.", "Bathe the newborn immediately."],
    answer: [1],
    rationale: "Drying and warm blankets reduce evaporative and conductive heat loss."
  },
  {
    id: 41,
    chapter: "Neurosensory System",
    category: "Safety and Infection Prevention and Control",
    type: "single",
    prompt: "Which seizure precaution is appropriate?",
    options: ["Keep suction equipment available.", "Place a spoon at the bedside for the mouth.", "Restrain the client during seizure activity.", "Keep bed rails down at all times."],
    answer: [0],
    rationale: "Suction and oxygen equipment should be available. Objects are not placed in the mouth and restraints can cause injury."
  },
  {
    id: 42,
    chapter: "Gastrointestinal System",
    category: "Health Promotion and Maintenance",
    type: "single",
    prompt: "Which instruction is best for a client with GERD?",
    options: ["Lie down immediately after meals.", "Eat large meals before bedtime.", "Avoid foods that trigger symptoms.", "Wear tight waistbands after eating."],
    answer: [2],
    rationale: "Avoiding triggers, smaller meals, remaining upright after meals, and weight management can reduce reflux symptoms."
  },
  {
    id: 43,
    chapter: "Genitourinary System",
    category: "Basic Care and Comfort",
    type: "single",
    prompt: "Which observation suggests fluid volume excess?",
    options: ["Sudden weight gain", "Dry mucous membranes", "Flat neck veins", "Concentrated urine only"],
    answer: [0],
    rationale: "Sudden weight gain commonly reflects fluid retention and should be monitored closely."
  },
  {
    id: 44,
    chapter: "Musculoskeletal System",
    category: "Health Promotion and Maintenance",
    type: "single",
    prompt: "Which teaching supports osteoporosis prevention?",
    options: ["Weight-bearing exercise as tolerated", "Avoid all sunlight", "Low-calcium diet", "Prolonged bedrest"],
    answer: [0],
    rationale: "Weight-bearing exercise, adequate calcium/vitamin D, and fall prevention support bone health."
  },
  {
    id: 45,
    chapter: "Mental Health Client",
    category: "Coordinated Care",
    type: "single",
    prompt: "A client reports intimate partner violence. What is the nurse's priority?",
    options: ["Tell the client to leave immediately without planning.", "Assess immediate safety and follow reporting policy.", "Contact the partner for an explanation.", "Promise secrecy under all circumstances."],
    answer: [1],
    rationale: "Immediate safety, mandated reporting requirements, documentation, and referral resources are priorities."
  },
  {
    id: 46,
    chapter: "Pharmacology",
    category: "Reduction of Risk Potential",
    type: "single",
    prompt: "Which abbreviation should the nurse avoid because it can cause medication errors?",
    options: ["mL", "mg", "U for units", "PO"],
    answer: [2],
    rationale: "The abbreviation U can be mistaken for zero or four; write 'units' to reduce medication errors."
  },
  {
    id: 47,
    chapter: "Essential Concepts",
    category: "Psychosocial Integrity",
    type: "single",
    prompt: "A client from a different culture refuses a treatment. What is the best initial response?",
    options: ["Explain that refusal is not allowed.", "Ask what concerns or beliefs affect the decision.", "Document noncompliance and leave.", "Ask the family to force agreement."],
    answer: [1],
    rationale: "Culturally respectful care begins by assessing the client's values, understanding, and preferences."
  },
  {
    id: 48,
    chapter: "Comprehensive Practice",
    category: "Physiological Adaptation",
    type: "multi",
    prompt: "A client has vomiting, weakness, irregular pulse, and potassium 2.9 mEq/L. Which actions are appropriate? Select all that apply.",
    options: ["Report hypokalemia.", "Monitor cardiac rhythm as ordered.", "Encourage prescribed potassium replacement.", "Give a loop diuretic without checking orders.", "Assess for muscle weakness."],
    answer: [0, 1, 2, 4],
    rationale: "Hypokalemia can cause weakness and dysrhythmias. The nurse reports, monitors, administers ordered replacement, and assesses symptoms."
  }
];
