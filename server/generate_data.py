import csv
import random
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

HEADER = [
    "mode", # stream, course, career, career_commerce
    # 10th subjects
    "Mathematics_10th", "Science_10th", "Social_Science_10th", "English_10th", "Hindi_10th", "Computer_Applications_10th",
    # 12th subjects
    "Mathematics_12th", "Physics_12th", "Chemistry_12th", "English_12th", "Computer_Science_12th", "Biology_12th", "Accountancy_12th", "Business_Studies_12th", "Economics_12th", "Hindi_12th",
    # College subjects (Sci/Tech)
    "Data_Structures", "Operating_Systems", "Database_Management", "Machine_Learning", "Artificial_Intelligence", "Cloud_Computing", "Cyber_Security",
    # College subjects (Commerce)
    "Financial_Accounting", "Corporate_Laws", "Business_Statistics", "Macroeconomics", "Cost_Accounting", "Corporate_Finance", "Auditing", "Marketing_Management", "Human_Resource_Management",
    # Programming skills
    "Python", "Java", "C_plus_plus", "JavaScript", "SQL",
    # Soft skills
    "Communication", "Leadership", "Problem_Solving", "Critical_Thinking", "Team_Work",
    # Target label
    "label"
]

def generate_stream_row():
    # 10th grade student
    math = random.randint(40, 100)
    sci = random.randint(40, 100)
    soc = random.randint(40, 100)
    eng = random.randint(40, 100)
    hin = random.randint(40, 100)
    comp = random.randint(40, 100)

    # Determine label based on simple rules with noise
    pcm_score = math * 0.4 + sci * 0.4 + comp * 0.2
    pcb_score = sci * 0.6 + math * 0.2 + eng * 0.2
    comm_score = math * 0.3 + soc * 0.3 + eng * 0.4
    arts_score = soc * 0.5 + eng * 0.3 + hin * 0.2

    # Add random noise
    pcm_score += random.uniform(-5, 5)
    pcb_score += random.uniform(-5, 5)
    comm_score += random.uniform(-5, 5)
    arts_score += random.uniform(-5, 5)

    scores = {
        "Science Elective (PCM with Computer Science)": pcm_score,
        "Science with Biology (PCB)": pcb_score,
        "Commerce with Applied Math": comm_score,
        "Arts with Humanities": arts_score
    }
    label = max(scores, key=scores.get)

    row = ["stream"] + [
        math, sci, soc, eng, hin, comp, # 10th
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, # 12th (empty)
        0, 0, 0, 0, 0, 0, 0, # College Sci/Tech (empty)
        0, 0, 0, 0, 0, 0, 0, 0, 0, # College Commerce (empty)
        0, 0, 0, 0, 0, # Prog (empty)
        0, 0, 0, 0, 0, # Soft (empty)
        label
    ]
    return row

def generate_course_row():
    # 12th grade student
    math = random.randint(40, 100)
    phys = random.randint(40, 100)
    chem = random.randint(40, 100)
    eng = random.randint(40, 100)
    cs = random.randint(40, 100)
    bio = random.randint(40, 100)
    acc = random.randint(40, 100)
    bs = random.randint(40, 100)
    econ = random.randint(40, 100)
    hin = random.randint(40, 100)

    # Determine label based on rules
    cse_score = cs * 0.4 + math * 0.4 + phys * 0.2
    ds_score = math * 0.5 + cs * 0.3 + econ * 0.2
    
    # Diploma IT (High CS interest, moderate grades)
    dip_it_score = cs * 0.5 + math * 0.3 + phys * 0.2
    if max(math, phys, cs) < 75:
        dip_it_score += 12

    mbbs_score = bio * 0.5 + chem * 0.3 + phys * 0.2
    
    # Diploma Pharmacy / Nursing
    dip_pharm_score = bio * 0.6 + chem * 0.4
    if max(bio, chem, phys) < 75:
        dip_pharm_score += 12

    # CA / CS Professional Course
    ca_score = acc * 0.5 + bs * 0.3 + econ * 0.2
    if min(acc, bs) > 85:
        ca_score += 18
        
    bcom_score = acc * 0.4 + bs * 0.3 + econ * 0.3
    
    # Diploma Business Administration
    dip_bus_score = bs * 0.5 + econ * 0.3 + eng * 0.2
    if max(acc, bs, econ) < 70:
        dip_bus_score += 12

    arts_score = eng * 0.5 + hin * 0.3 + econ * 0.2
    
    # Professional Diploma in Digital Marketing
    dip_mkt_score = eng * 0.4 + cs * 0.3 + econ * 0.3
    if max(eng, cs) < 75:
        dip_mkt_score += 12

    # Add noise
    cse_score += random.uniform(-4, 4)
    ds_score += random.uniform(-4, 4)
    dip_it_score += random.uniform(-4, 4)
    mbbs_score += random.uniform(-4, 4)
    dip_pharm_score += random.uniform(-4, 4)
    ca_score += random.uniform(-4, 4)
    bcom_score += random.uniform(-4, 4)
    dip_bus_score += random.uniform(-4, 4)
    arts_score += random.uniform(-4, 4)
    dip_mkt_score += random.uniform(-4, 4)

    scores = {
        "B.Tech in Computer Science & Engineering (AI/ML)": cse_score,
        "B.Sc in Data Science": ds_score,
        "Diploma in Computer Engineering / IT": dip_it_score,
        "Bachelor of Medicine / BDS (MBBS)": mbbs_score,
        "Diploma in General Nursing & Pharmacy": dip_pharm_score,
        "Chartered Accountancy (CA) / CS Program": ca_score,
        "Bachelor of Commerce (B.Com Hons)": bcom_score,
        "Diploma in Business Administration (DBA)": dip_bus_score,
        "Bachelor of Arts (Humanities)": arts_score,
        "Professional Diploma in Digital Marketing & Design": dip_mkt_score
    }
    label = max(scores, key=scores.get)

    row = ["course"] + [
        0, 0, 0, 0, 0, 0, # 10th (empty)
        math, phys, chem, eng, cs, bio, acc, bs, econ, hin, # 12th
        0, 0, 0, 0, 0, 0, 0, # College Sci/Tech (empty)
        0, 0, 0, 0, 0, 0, 0, 0, 0, # College Commerce (empty)
        0, 0, 0, 0, 0, # Prog (empty)
        0, 0, 0, 0, 0, # Soft (empty)
        label
    ]
    return row

def generate_career_row():
    # College level
    ds_mark = random.randint(40, 100)
    os_mark = random.randint(40, 100)
    db_mark = random.randint(40, 100)
    ml_mark = random.randint(40, 100)
    ai_mark = random.randint(40, 100)
    cloud_mark = random.randint(40, 100)
    cyber_mark = random.randint(40, 100)

    py = random.randint(30, 100)
    java = random.randint(30, 100)
    cpp = random.randint(30, 100)
    js = random.randint(30, 100)
    sql = random.randint(30, 100)

    comm = random.randint(30, 100)
    lead = random.randint(30, 100)
    prob = random.randint(30, 100)
    crit = random.randint(30, 100)
    team = random.randint(30, 100)

    # Label rules
    mle_score = py * 0.3 + prob * 0.3 + ml_mark * 0.2 + ai_mark * 0.2
    ds_score = py * 0.3 + sql * 0.3 + db_mark * 0.2 + prob * 0.2
    fs_score = js * 0.4 + sql * 0.2 + ds_mark * 0.2 + prob * 0.2
    devops_score = cloud_mark * 0.3 + os_mark * 0.3 + java * 0.2 + team * 0.2
    cyber_score = cyber_mark * 0.4 + crit * 0.3 + os_mark * 0.3
    pm_score = lead * 0.4 + comm * 0.3 + team * 0.3

    # Add noise
    mle_score += random.uniform(-5, 5)
    ds_score += random.uniform(-5, 5)
    fs_score += random.uniform(-5, 5)
    devops_score += random.uniform(-5, 5)
    cyber_score += random.uniform(-5, 5)
    pm_score += random.uniform(-5, 5)

    scores = {
        "Machine Learning Engineer": mle_score,
        "Data Scientist": ds_score,
        "Full Stack Engineer": fs_score,
        "DevOps Cloud Engineer": devops_score,
        "Cyber Security Analyst": cyber_score,
        "Product/Project Manager": pm_score
    }
    label = max(scores, key=scores.get)

    row = ["career"] + [
        0, 0, 0, 0, 0, 0, # 10th (empty)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, # 12th (empty)
        ds_mark, os_mark, db_mark, ml_mark, ai_mark, cloud_mark, cyber_mark, # College Sci/Tech
        0, 0, 0, 0, 0, 0, 0, 0, 0, # College Commerce (empty)
        py, java, cpp, js, sql, # Prog
        comm, lead, prob, crit, team, # Soft
        label
    ]
    return row

def generate_career_commerce_row():
    # College level commerce
    fin_acc = random.randint(40, 100)
    corp_law = random.randint(40, 100)
    bus_stat = random.randint(40, 100)
    macro_econ = random.randint(40, 100)
    cost_acc = random.randint(40, 100)
    corp_fin = random.randint(40, 100)
    audit = random.randint(40, 100)
    mkt_mgmt = random.randint(40, 100)
    hr_mgmt = random.randint(40, 100)

    # Skills (Commerce students have some SQL/Python/JavaScript occasionally, but let's keep it moderate)
    py = random.randint(10, 70)
    java = random.randint(10, 60)
    cpp = random.randint(10, 60)
    js = random.randint(10, 70)
    sql = random.randint(20, 80)

    comm = random.randint(40, 100)
    lead = random.randint(40, 100)
    prob = random.randint(40, 100)
    crit = random.randint(40, 100)
    team = random.randint(40, 100)

    # Label rules
    ib_score = corp_fin * 0.4 + fin_acc * 0.3 + bus_stat * 0.3
    ca_score = fin_acc * 0.4 + cost_acc * 0.3 + audit * 0.3
    consult_score = prob * 0.3 + lead * 0.3 + macro_econ * 0.2 + comm * 0.2
    mkt_score = mkt_mgmt * 0.5 + comm * 0.3 + lead * 0.2
    hr_score = hr_mgmt * 0.5 + comm * 0.3 + team * 0.2
    ba_score = bus_stat * 0.4 + sql * 0.3 + macro_econ * 0.3

    # Add noise
    ib_score += random.uniform(-5, 5)
    ca_score += random.uniform(-5, 5)
    consult_score += random.uniform(-5, 5)
    mkt_score += random.uniform(-5, 5)
    hr_score += random.uniform(-5, 5)
    ba_score += random.uniform(-5, 5)

    scores = {
        "Financial Analyst / Investment Banker": ib_score,
        "Chartered Accountant (CA)": ca_score,
        "Management Consultant": consult_score,
        "Marketing Executive": mkt_score,
        "HR Specialist": hr_score,
        "Business Analyst": ba_score
    }
    label = max(scores, key=scores.get)

    row = ["career_commerce"] + [
        0, 0, 0, 0, 0, 0, # 10th (empty)
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, # 12th (empty)
        0, 0, 0, 0, 0, 0, 0, # College Sci/Tech (empty)
        fin_acc, corp_law, bus_stat, macro_econ, cost_acc, corp_fin, audit, mkt_mgmt, hr_mgmt, # College Commerce
        py, java, cpp, js, sql, # Prog
        comm, lead, prob, crit, team, # Soft
        label
    ]
    return row

def main():
    rows_stream = 1500
    rows_course = 1500
    rows_career = 1000
    rows_career_commerce = 1000
    
    total_rows = rows_stream + rows_course + rows_career + rows_career_commerce
    print(f"Generating dataset of {total_rows} rows...")
    
    with open("student_dataset.csv", mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(HEADER)
        
        for _ in range(rows_stream):
            writer.writerow(generate_stream_row())
            
        for _ in range(rows_course):
            writer.writerow(generate_course_row())
            
        for _ in range(rows_career):
            writer.writerow(generate_career_row())
            
        for _ in range(rows_career_commerce):
            writer.writerow(generate_career_commerce_row())
            
    print("Dataset generation completed! Saved as 'student_dataset.csv'.")

if __name__ == "__main__":
    main()
