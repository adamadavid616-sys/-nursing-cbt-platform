const conceptBank = [
  ["Anatomy and Physiology", "Physiological Adaptation", "sinoatrial node", "It initiates the normal electrical impulse of the heart.", ["It stores bile for digestion.", "It filters cerebrospinal fluid.", "It secretes insulin."], "The SA node is the heart's natural pacemaker and starts normal sinus rhythm."],
  ["Anatomy and Physiology", "Physiological Adaptation", "alveoli", "They are the main site of oxygen and carbon dioxide exchange.", ["They warm urine before excretion.", "They produce bile salts.", "They regulate blood glucose directly."], "Gas exchange occurs across the thin alveolar-capillary membrane."],
  ["Anatomy and Physiology", "Physiological Adaptation", "nephron", "It is the functional unit of the kidney.", ["It is the contractile unit of skeletal muscle.", "It is the pacemaker of the heart.", "It is the hormone-secreting unit of the thyroid."], "The nephron filters blood and forms urine through filtration, reabsorption, and secretion."],
  ["Anatomy and Physiology", "Physiological Adaptation", "islets of Langerhans", "They contain pancreatic cells that regulate blood glucose.", ["They produce surfactant in the lungs.", "They filter lymph in lymph nodes.", "They conduct impulses through the spinal cord."], "Pancreatic islets include insulin- and glucagon-secreting cells."],
  ["Anatomy and Physiology", "Physiological Adaptation", "myelin sheath", "It speeds transmission of nerve impulses.", ["It digests dietary fat.", "It stores red blood cells.", "It prevents urine reflux."], "Myelin insulates nerve fibers and improves conduction speed."],
  ["Anatomy and Physiology", "Physiological Adaptation", "platelets", "They help form clots and prevent bleeding.", ["They transport oxygen as hemoglobin.", "They produce antibodies.", "They secrete bile."], "Platelets aggregate at injury sites and participate in clot formation."],
  ["Anatomy and Physiology", "Physiological Adaptation", "thyroxine", "It increases metabolic activity in body tissues.", ["It lowers blood calcium rapidly.", "It clots blood at injury sites.", "It neutralizes stomach acid."], "Thyroid hormone affects metabolism, growth, and energy use."],
  ["Anatomy and Physiology", "Physiological Adaptation", "uterus", "It supports fetal growth during pregnancy.", ["It produces sperm cells.", "It stores bile.", "It filters blood plasma into urine."], "The uterus is the muscular reproductive organ where the fetus develops."],
  ["Fundamentals of Nursing", "Safety and Infection Prevention and Control", "medical asepsis", "It reduces the number and spread of microorganisms.", ["It completely removes all microorganisms from tissue.", "It is only used in operating theatres.", "It replaces hand hygiene."], "Medical asepsis is clean technique used to reduce transmission of organisms."],
  ["Fundamentals of Nursing", "Safety and Infection Prevention and Control", "surgical asepsis", "It keeps objects and areas free from all microorganisms.", ["It is the same as routine bathing.", "It is used only for oral medication.", "It means using soap without gloves."], "Surgical asepsis is sterile technique for invasive or sterile procedures."],
  ["Fundamentals of Nursing", "Basic Care and Comfort", "pressure injury prevention", "Repositioning and skin inspection reduce tissue damage.", ["Massage reddened bony areas firmly.", "Keep the patient wet to cool the skin.", "Use one position for comfort all day."], "Pressure injuries are prevented by pressure relief, moisture control, nutrition, and skin checks."],
  ["Fundamentals of Nursing", "Reduction of Risk Potential", "intake and output", "It helps monitor fluid balance.", ["It measures only calorie intake.", "It confirms blood type.", "It replaces daily weight."], "I&O is important in renal, cardiac, postoperative, and fluid therapy monitoring."],
  ["Fundamentals of Nursing", "Basic Care and Comfort", "bed bath", "Clean from the cleanest area to the dirtiest area.", ["Clean the perineum before the face.", "Reuse dirty water for all body parts.", "Avoid checking skin during bathing."], "Bathing is also an opportunity to assess skin, mobility, pain, and hygiene needs."],
  ["Fundamentals of Nursing", "Coordinated Care", "documentation", "Record objective facts clearly, promptly, and accurately.", ["Document care before giving it.", "Erase wrong entries completely.", "Use vague phrases to save time."], "Good documentation supports continuity, legal safety, and evaluation of care."],
  ["Fundamentals of Nursing", "Basic Care and Comfort", "range-of-motion exercise", "It helps maintain joint mobility and prevent contractures.", ["It cures all fractures.", "It should force painful joints beyond limit.", "It replaces turning an immobile patient."], "ROM protects mobility but must be performed safely and within tolerance."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "shock", "Poor tissue perfusion can cause organ failure.", ["It always begins with hypertension.", "It is treated by delaying assessment.", "It affects only the skin."], "Shock is a life-threatening perfusion problem; early recognition is critical."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "heart failure", "Fluid overload may cause dyspnea, edema, and fatigue.", ["It always causes severe dehydration.", "It improves with high-sodium meals.", "It means the heart has stopped completely."], "Heart failure reduces pumping effectiveness and may produce pulmonary/systemic congestion."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "stroke", "Sudden facial droop, arm weakness, or speech difficulty needs urgent response.", ["It is best managed by waiting for sleep.", "It only affects elderly clients.", "It is confirmed by checking appetite."], "Neurologic changes can indicate brain ischemia or bleeding and require rapid action."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "asthma attack", "Wheezing and respiratory distress require prompt bronchodilator therapy as ordered.", ["Encourage lying flat during severe dyspnea.", "Withhold rescue inhalers during wheeze.", "Give a heavy meal first."], "Asthma involves bronchospasm and airway inflammation."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "COPD", "Pursed-lip breathing helps slow expiration and reduce air trapping.", ["High-flow oxygen is always used without prescription.", "Coughing should always be suppressed.", "Exercise must be permanently avoided."], "COPD care focuses on airway clearance, energy conservation, breathing techniques, and infection prevention."],
  ["Medical-Surgical Nursing", "Reduction of Risk Potential", "renal failure", "Hyperkalemia is dangerous because it can cause dysrhythmias.", ["Low potassium is always expected.", "Protein is always unlimited.", "Urine output always increases."], "Kidney failure can impair potassium excretion."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "diabetic ketoacidosis", "Hyperglycemia, ketones, dehydration, and acidosis are key concerns.", ["It is caused by excess insulin only.", "It is treated with sugar drinks alone.", "It causes slow deep breathing to stop immediately."], "DKA is an emergency requiring fluids, insulin, electrolytes, and monitoring."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "burns", "Fluid loss and shock are early priorities in major burns.", ["Itching is the only emergency sign.", "Oral fluids alone treat all major burns.", "Sterile technique is unnecessary."], "Burn care prioritizes airway, circulation, infection prevention, pain control, and wound care."],
  ["Medical-Surgical Nursing", "Reduction of Risk Potential", "fracture neurovascular assessment", "Pain, pallor, pulselessness, paresthesia, and paralysis suggest compromise.", ["Only appetite should be checked.", "Tight casts should never be reported.", "Numbness is always expected."], "Neurovascular checks detect impaired circulation or nerve function early."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "appendicitis", "Right lower quadrant pain with fever and nausea suggests inflammation.", ["Give enemas before assessment.", "Apply heat to reduce rupture risk.", "Encourage heavy meals."], "Appendicitis can rupture, so worsening pain and peritonitis signs are urgent."],
  ["Medical-Surgical Nursing", "Reduction of Risk Potential", "postoperative atelectasis", "Deep breathing, coughing, and early mobility help prevent it.", ["Strict bed rest prevents all lung problems.", "Fluids should always be withheld.", "Pain control has no effect on breathing."], "Postoperative lung expansion reduces retained secretions and alveolar collapse."],
  ["Maternal and Child Health", "Health Promotion and Maintenance", "preeclampsia danger signs", "Severe headache, visual disturbance, and epigastric pain are urgent.", ["Mild ankle edema alone confirms eclampsia.", "All headaches in pregnancy are normal.", "Protein intake should be stopped."], "These symptoms can precede seizures or severe maternal-fetal complications."],
  ["Maternal and Child Health", "Physiological Adaptation", "postpartum hemorrhage", "Heavy bleeding or rapid pad saturation requires immediate action.", ["It is normal to soak a pad every 10 minutes.", "The fundus should never be assessed.", "Fluids are always restricted."], "Postpartum hemorrhage threatens circulation and requires fundal assessment and escalation."],
  ["Maternal and Child Health", "Health Promotion and Maintenance", "newborn thermoregulation", "Drying and warming prevent heat loss.", ["Immediate bathing prevents cold stress.", "A wet newborn should be left uncovered.", "Fans help stabilize temperature."], "Newborns lose heat quickly through evaporation, conduction, convection, and radiation."],
  ["Maternal and Child Health", "Health Promotion and Maintenance", "exclusive breastfeeding", "Breast milk supports infant nutrition and immunity.", ["Colostrum should be discarded.", "Water is required from birth.", "Breastfeeding prevents all illness."], "Breastfeeding education is a common maternal-child health topic."],
  ["Maternal and Child Health", "Health Promotion and Maintenance", "growth milestones", "Development is assessed by age-appropriate motor, language, social, and cognitive skills.", ["All children develop at exactly the same age.", "Only weight matters.", "Milestones are unrelated to health assessment."], "Milestones help identify delayed development and guide referral."],
  ["Maternal and Child Health", "Safety and Infection Prevention and Control", "immunization", "Vaccines reduce risk of preventable infectious diseases.", ["They are only needed after illness occurs.", "Cold chain is unimportant.", "All vaccines are given by the same route."], "Immunization questions often test schedule, contraindications, cold chain, and caregiver teaching."],
  ["Community Health", "Health Promotion and Maintenance", "primary health care", "It emphasizes accessibility, prevention, community participation, and equity.", ["It is only hospital-based intensive care.", "It excludes health education.", "It is only for private clinics."], "PHC is foundational in community health and public health nursing."],
  ["Community Health", "Safety and Infection Prevention and Control", "cold chain", "It keeps vaccines at recommended temperatures to preserve potency.", ["It is used to warm vaccines.", "It replaces expiry-date checks.", "It is only needed after injection."], "Cold chain failure can make vaccines ineffective."],
  ["Community Health", "Health Promotion and Maintenance", "home visit", "It assesses family needs in the home environment.", ["It is only for collecting fees.", "It avoids health education.", "It replaces clinic referral in emergencies."], "Home visiting supports assessment, teaching, follow-up, and community-based care."],
  ["Community Health", "Reduction of Risk Potential", "disease notification", "Prompt reporting supports outbreak control.", ["It is optional for all communicable diseases.", "It should wait until an outbreak ends.", "It is done only for surgical cases."], "Notification helps public health teams trace, prevent, and control disease spread."],
  ["Community Health", "Health Promotion and Maintenance", "health education", "Teaching should match the learner's needs, language, and readiness.", ["Use technical terms to impress the client.", "Ignore cultural beliefs.", "Teach only after discharge."], "Effective education is client-centered, clear, and evaluated."],
  ["Pharmacology", "Pharmacological Therapies", "digoxin", "Check apical pulse and watch for toxicity such as nausea or visual changes.", ["Give extra doses for bradycardia.", "Ignore pulse rate.", "It is mainly an antibiotic."], "Digoxin affects cardiac contractility and conduction."],
  ["Pharmacology", "Pharmacological Therapies", "insulin", "Monitor blood glucose and recognize hypoglycemia.", ["Give without regard to meals.", "Store every insulin in direct sunlight.", "Use it to treat bacterial infection."], "Insulin lowers blood glucose and can cause hypoglycemia."],
  ["Pharmacology", "Pharmacological Therapies", "warfarin", "Monitor for bleeding and maintain consistent vitamin K intake.", ["Take aspirin freely for pain.", "Double doses after missed doses.", "Expect black stools as normal."], "Warfarin is an anticoagulant; bleeding precautions and INR monitoring matter."],
  ["Pharmacology", "Pharmacological Therapies", "furosemide", "Monitor potassium, blood pressure, urine output, and dehydration.", ["Expect potassium retention always.", "Give at bedtime to improve sleep.", "It is a cough suppressant."], "Loop diuretics can cause fluid loss and hypokalemia."],
  ["Pharmacology", "Pharmacological Therapies", "antibiotics", "Check allergy history and teach completion of prescribed therapy.", ["Stop once fever reduces.", "Share remaining tablets.", "Avoid reporting rash or breathing difficulty."], "Antibiotic safety includes allergy assessment, adherence, and monitoring response."],
  ["Pharmacology", "Pharmacological Therapies", "opioid analgesics", "Monitor respiratory rate and sedation.", ["They always increase respiratory rate.", "They have no constipation risk.", "They are first-line for every mild pain."], "Opioids can depress respirations and cause sedation/constipation."],
  ["Pharmacology", "Pharmacological Therapies", "antihypertensives", "Check blood pressure and teach slow position changes.", ["Stop immediately once BP improves.", "Take double doses for missed tablets.", "Orthostatic hypotension is impossible."], "BP drugs can cause dizziness and require adherence teaching."],
  ["Mental Health", "Psychosocial Integrity", "therapeutic communication", "It uses active listening, empathy, and open-ended responses.", ["It gives false reassurance.", "It argues with the client.", "It changes the subject quickly."], "Therapeutic communication helps clients express feelings safely."],
  ["Mental Health", "Psychosocial Integrity", "suicide risk", "A specific plan requires immediate safety intervention.", ["Leave the client alone to rest.", "Promise secrecy.", "Challenge the client to prove it."], "Safety comes first when a client expresses intent or plan for self-harm."],
  ["Mental Health", "Psychosocial Integrity", "hallucination response", "Acknowledge the feeling without validating the false perception.", ["Tell the client the voices are definitely real.", "Ridicule the experience.", "Ignore safety assessment."], "The nurse supports reality and safety while respecting distress."],
  ["Mental Health", "Psychosocial Integrity", "alcohol withdrawal", "Tremors, agitation, hallucinations, and seizures are danger signs.", ["Withdrawal is never serious.", "Fluids and observation are irrelevant.", "Seizure precautions are unnecessary."], "Withdrawal can become life-threatening and requires monitoring."],
  ["Ethics and Management", "Coordinated Care", "delegation", "Assessment, teaching, and evaluation remain nursing responsibilities.", ["Delegate initial assessment to untrained personnel.", "Never supervise delegated care.", "Delegate only because a task is unpleasant."], "Safe delegation matches task, client stability, competence, and supervision."],
  ["Ethics and Management", "Coordinated Care", "confidentiality", "Client information is shared only with those involved in care.", ["Discuss named clients in elevators.", "Post patient details publicly.", "Share records with friends."], "Confidentiality protects privacy and professional trust."],
  ["Ethics and Management", "Coordinated Care", "informed consent", "The client needs adequate information and voluntary agreement.", ["Consent is valid if forced.", "A sedated client can sign complex consent.", "The nurse should invent surgical risks."], "The provider explains procedure risks; nurses witness and advocate."],
  ["Research and Biostatistics", "Reduction of Risk Potential", "informed consent in research", "Participants should understand risks, benefits, and voluntary withdrawal.", ["Participants can never withdraw.", "Consent is unnecessary if data are interesting.", "Risks should be hidden."], "Research ethics protects autonomy, safety, and dignity."],
  ["Research and Biostatistics", "Reduction of Risk Potential", "mean", "It is the arithmetic average of a set of values.", ["It is the most frequent value.", "It is the middle value only.", "It is the difference between highest and lowest."], "Mean is calculated by dividing the sum by the number of observations."],
  ["Research and Biostatistics", "Reduction of Risk Potential", "median", "It is the middle value when data are arranged in order.", ["It is always the largest value.", "It is the average of all values only.", "It is a type of vaccine."], "Median is useful when data are skewed."],
  ["OSCE", "Reduction of Risk Potential", "patient identification", "Use at least two identifiers before procedures or medication.", ["Ask only the bed number.", "Skip identity checks for familiar patients.", "Use diagnosis as the only identifier."], "Correct identification prevents wrong-patient errors."],
  ["OSCE", "Safety and Infection Prevention and Control", "hand hygiene", "It is required before and after patient contact and aseptic tasks.", ["It is optional when gloves are used.", "It is needed only after visible dirt.", "It replaces sterile technique."], "Hand hygiene is one of the highest-yield OSCE safety steps."],
  ["OSCE", "Reduction of Risk Potential", "documentation after procedure", "Record what was done, findings, patient response, and any report made.", ["Document before performing the skill.", "Leave abnormal findings undocumented.", "Use unclear abbreviations."], "Documentation completes the nursing procedure and supports continuity."],
  ["OSCE", "Basic Care and Comfort", "patient privacy", "Close curtains or doors and expose only necessary areas.", ["Expose the patient to save time.", "Discuss private details loudly.", "Ignore cultural comfort."], "Privacy preserves dignity and supports professional care."]
];

const priorityScenarios = [
  ["Fundamentals of Nursing", "Safety and Infection Prevention and Control", "A client is about to receive wound dressing.", "perform hand hygiene and prepare a clean/sterile field as required", ["give oral fluids first", "leave the wound open while searching for supplies", "document the dressing before doing it"], "Infection prevention is the priority before wound care."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "A postoperative client suddenly becomes cyanotic.", "assess airway patency and call for help", ["offer a meal", "wait for the next routine observation", "ask the relatives to keep watching"], "Cyanosis suggests oxygenation failure; airway and breathing come first."],
  ["Medical-Surgical Nursing", "Physiological Adaptation", "A diabetic client is sweaty, shaky, and confused but can swallow.", "give a fast-acting carbohydrate and recheck glucose", ["administer long-acting insulin immediately", "keep the client NPO", "encourage exercise"], "These are hypoglycemia cues; treat rapidly if the client can swallow."],
  ["Maternal and Child Health", "Physiological Adaptation", "A postpartum woman soaks a pad within minutes.", "assess fundus and report possible hemorrhage immediately", ["encourage sleep", "delay review until the next round", "give routine discharge teaching"], "Rapid bleeding after birth can become shock."],
  ["Maternal and Child Health", "Reduction of Risk Potential", "A newborn is wet after delivery.", "dry and warm the newborn promptly", ["bathe immediately", "place under a fan", "delay warming until after weighing"], "Drying prevents evaporative heat loss."],
  ["Community Health", "Safety and Infection Prevention and Control", "A vaccine refrigerator has been off overnight.", "quarantine vaccines and report cold-chain breach", ["use the vaccines quickly", "freeze all vaccines", "ignore because they still look normal"], "Cold-chain failure can reduce potency."],
  ["Pharmacology", "Pharmacological Therapies", "A client on warfarin reports black tarry stool.", "report possible gastrointestinal bleeding", ["document as normal", "encourage aspirin", "give the next dose early"], "Melena can indicate bleeding."],
  ["Mental Health", "Psychosocial Integrity", "A client says, 'I will take all my tablets tonight.'", "stay with the client and initiate suicide safety precautions", ["promise secrecy", "leave the client to calm down", "tell the client not to be dramatic"], "A stated suicide plan requires immediate safety action."],
  ["OSCE", "Reduction of Risk Potential", "During medication OSCE, the chart dose looks unusually high.", "pause, recheck the order, and clarify before administration", ["give it because the examiner is watching", "ask the patient to decide the dose", "skip documentation"], "Medication safety requires clarification of unsafe or unclear orders."],
  ["Ethics and Management", "Coordinated Care", "A student hears staff discussing a named patient in public.", "interrupt respectfully and protect confidentiality", ["join the discussion", "post about it online", "wait until discharge"], "Confidentiality breaches should be stopped promptly."]
];

function shuffleOptions(correct, distractors) {
  const options = [correct, ...distractors];
  return options.map((text, index) => ({ text, original: index })).sort((a, b) => textKey(a.text).localeCompare(textKey(b.text)));
}

function textKey(text) {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0).toString();
}

function makeKnowledgeQuestion(item, index) {
  const [course, category, topic, correct, distractors, explanation] = item;
  const ordered = shuffleOptions(correct, distractors);
  return {
    id: `nmcn-exp-k-${index + 1}`,
    source: "A_D NMCN-style expansion bank",
    chapter: course,
    category,
    type: "single",
    prompt: `Which statement best describes ${topic}?`,
    options: ordered.map((option) => option.text),
    answer: [ordered.findIndex((option) => option.original === 0)],
    rationale: `${explanation} This original item was added to strengthen ${course} revision for council and hospital-final preparation.`
  };
}

function makeTeachingQuestion(item, index) {
  const [course, category, topic, correct, distractors, explanation] = item;
  const wrong = distractors[0];
  const ordered = shuffleOptions(wrong, [correct, distractors[1], distractors[2]]);
  return {
    id: `nmcn-exp-t-${index + 1}`,
    source: "A_D NMCN-style expansion bank",
    chapter: course,
    category,
    type: "single",
    prompt: `A student is revising ${topic}. Which statement shows a need for further teaching?`,
    options: ordered.map((option) => option.text),
    answer: [ordered.findIndex((option) => option.original === 0)],
    rationale: `${wrong} is the incorrect statement. ${explanation}`
  };
}

function makeScenarioQuestion(item, index) {
  const [course, category, scenario, correct, distractors, explanation] = item;
  const ordered = shuffleOptions(correct, distractors);
  return {
    id: `nmcn-exp-s-${index + 1}`,
    source: "A_D NMCN-style expansion bank",
    chapter: course,
    category,
    type: "single",
    prompt: `${scenario} What should the nurse do first?`,
    options: ordered.map((option) => option.text),
    answer: [ordered.findIndex((option) => option.original === 0)],
    rationale: `${explanation} The first action should address the most immediate safety or assessment priority.`
  };
}

function makeRevisionQuestion(item, index) {
  const [course, category, topic, correct, distractors, explanation] = item;
  const ordered = shuffleOptions(`Remember: ${correct}`, [
    `Avoid: ${distractors[0]}`,
    `Avoid: ${distractors[1]}`,
    `Avoid: ${distractors[2]}`
  ]);
  return {
    id: `nmcn-exp-r-${index + 1}`,
    source: "A_D NMCN-style expansion bank",
    chapter: course,
    category,
    type: "single",
    prompt: `Which revision note is most accurate for ${topic}?`,
    options: ordered.map((option) => option.text),
    answer: [ordered.findIndex((option) => option.original === 0)],
    rationale: `${explanation} This note is useful because council-style questions often test the safest or most physiologically correct statement.`
  };
}

export const nmcnSaturationQuestions = [
  ...conceptBank.map(makeKnowledgeQuestion),
  ...conceptBank.map(makeTeachingQuestion),
  ...conceptBank.map(makeRevisionQuestion),
  ...priorityScenarios.map(makeScenarioQuestion)
];

const courseBlueprint = [
  ["Anatomy and Physiology", "Physiological Adaptation", ["heart", "lungs", "kidneys", "brain", "liver", "pancreas", "uterus", "blood", "skin", "thyroid gland"], ["normal function", "major structure", "common abnormal sign", "nursing implication"]],
  ["Fundamentals of Nursing", "Basic Care and Comfort", ["vital signs", "bed making", "hygiene", "positioning", "nutrition", "elimination", "mobility", "wound care", "oxygen therapy", "documentation"], ["safest action", "first assessment", "patient teaching", "common error"]],
  ["Medical-Surgical Nursing", "Physiological Adaptation", ["heart failure", "hypertension", "stroke", "asthma", "COPD", "diabetes mellitus", "renal failure", "burns", "fracture", "peptic ulcer"], ["priority symptom", "urgent complication", "nursing intervention", "discharge teaching"]],
  ["Maternal and Child Health", "Health Promotion and Maintenance", ["antenatal care", "labour", "postpartum care", "newborn care", "breastfeeding", "immunization", "growth milestone", "dehydration in children", "preeclampsia", "family planning"], ["danger sign", "health teaching", "normal finding", "urgent nursing action"]],
  ["Community Health", "Health Promotion and Maintenance", ["primary health care", "cold chain", "home visiting", "school health", "disease surveillance", "environmental sanitation", "nutrition education", "immunization clinic", "family health", "outbreak control"], ["community priority", "prevention strategy", "teaching focus", "reporting action"]],
  ["Pharmacology", "Pharmacological Therapies", ["digoxin", "insulin", "warfarin", "furosemide", "antibiotics", "opioids", "antihypertensives", "antimalarials", "oxytocin", "bronchodilators"], ["pre-administration check", "side effect", "toxicity sign", "patient teaching"]],
  ["Mental Health", "Psychosocial Integrity", ["anxiety", "depression", "psychosis", "suicide risk", "substance withdrawal", "therapeutic communication", "confidentiality", "aggression", "grief", "bipolar disorder"], ["therapeutic response", "safety action", "wrong response", "assessment priority"]],
  ["Research and Biostatistics", "Reduction of Risk Potential", ["mean", "median", "mode", "sample", "population", "research ethics", "questionnaire", "validity", "reliability", "data presentation"], ["definition", "best use", "common mistake", "interpretation"]],
  ["OSCE", "Reduction of Risk Potential", ["hand hygiene", "patient identification", "vital signs", "wound dressing", "urine testing", "medication administration", "oxygen therapy", "catheter care", "health education", "documentation"], ["critical step", "common error", "closing step", "safety check"]],
  ["Ethics and Management", "Coordinated Care", ["delegation", "consent", "documentation", "confidentiality", "incident reporting", "ward management", "leadership", "patient rights", "professional conduct", "team communication"], ["legal responsibility", "best action", "unsafe practice", "communication priority"]]
];

const stems = [
  "Which option is most appropriate when revising {topic} in {course}?",
  "A student nurse is asked about {topic}. Which answer is best?",
  "In a council-style question on {topic}, which point should guide the nurse?",
  "Which statement is most accurate about the {focus} of {topic}?",
  "During hospital-final preparation, which note about {topic} is safest?",
  "Which response shows correct understanding of {topic}?",
  "A nurse is caring for a client where {topic} is relevant. Which option is best?",
  "Which finding or action related to {topic} should receive priority?",
  "What should the nurse remember about {topic} during examination practice?",
  "Which teaching point about {topic} is most correct?"
];

const correctPatterns = [
  "Assess the client first and choose the safest action related to {topic}.",
  "Link {topic} to patient safety, early recognition, and timely reporting.",
  "Use the nursing process: assess, plan, intervene safely, then evaluate.",
  "Prioritize airway, breathing, circulation, bleeding, infection prevention, and neurologic change.",
  "Give clear teaching and confirm the client understands the key point.",
  "Document accurately after performing the required nursing action.",
  "Report abnormal findings promptly when they suggest deterioration.",
  "Prevent complications by acting early and following procedure sequence.",
  "Use evidence-based nursing care rather than guesswork or routine alone.",
  "Respect dignity, privacy, consent, and infection-prevention principles."
];

const distractorPatterns = [
  "Delay assessment until the end of the shift even if symptoms worsen.",
  "Choose the option that is fastest even when it ignores safety.",
  "Document care before it has been performed.",
  "Give reassurance without checking the client's condition.",
  "Ignore abnormal findings if the client is not complaining loudly.",
  "Skip hand hygiene when gloves are available.",
  "Use family members as the only source of consent for every adult client.",
  "Perform invasive care without explanation or privacy.",
  "Stop prescribed therapy as soon as the client feels better.",
  "Choose an option unrelated to the problem in the question stem."
];

function fill(template, values) {
  return template
    .replaceAll("{course}", values.course)
    .replaceAll("{category}", values.category)
    .replaceAll("{topic}", values.topic)
    .replaceAll("{focus}", values.focus);
}

function makeMassQuestion(index) {
  const blueprint = courseBlueprint[index % courseBlueprint.length];
  const [course, category, topics, focuses] = blueprint;
  const topic = topics[Math.floor(index / courseBlueprint.length) % topics.length];
  const focus = focuses[Math.floor(index / (courseBlueprint.length * topics.length)) % focuses.length];
  const values = { course, category, topic, focus };
  const prompt = fill(stems[index % stems.length], values);
  const correct = fill(correctPatterns[(index + topics.length) % correctPatterns.length], values);
  const distractors = [
    fill(distractorPatterns[(index + 1) % distractorPatterns.length], values),
    fill(distractorPatterns[(index + 4) % distractorPatterns.length], values),
    fill(distractorPatterns[(index + 7) % distractorPatterns.length], values)
  ];
  const ordered = shuffleOptions(correct, distractors);
  return {
    id: `nmcn-mass-${index + 1}`,
    source: "A_D 10,000-question NMCN-style practice expansion",
    chapter: course,
    category,
    type: "single",
    prompt,
    options: ordered.map((option) => option.text),
    answer: [ordered.findIndex((option) => option.original === 0)],
    rationale: `${correct} This original practice item reinforces ${focus} in ${topic}. It is designed for repeated CBT drilling, so focus on the safety principle behind the answer rather than memorizing the wording.`
  };
}

const existingExpansionCount = nmcnSaturationQuestions.length;
const targetExpansionCount = 7041;
const massQuestions = Array.from(
  { length: Math.max(0, targetExpansionCount - existingExpansionCount) },
  (_, index) => makeMassQuestion(index)
);

nmcnSaturationQuestions.push(...massQuestions);
