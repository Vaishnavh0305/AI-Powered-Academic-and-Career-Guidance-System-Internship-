import sys
import json
import pickle
import os
import numpy as np
import warnings

# Suppress sklearn feature names warning
warnings.filterwarnings("ignore", category=UserWarning)

def load_model(path):
    with open(path, "rb") as f:
        return pickle.load(f)

def format_percentage(val):
    return f"{min(99, max(30, int(round(val * 100))))}%"

def predict():
    try:
        # Read request from stdin
        input_data = json.loads(sys.stdin.read())
    except Exception as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
        return

    mode = input_data.get("mode", "career")
    current_education = input_data.get("currentEducation", "")
    marks = input_data.get("marks", {})
    prog = input_data.get("programmingSkills", {})
    soft = input_data.get("softSkills", {})
    interests = input_data.get("interests", [])

    # Helper helper to fetch user score or realistic default
    def get_val(src, key, default=70):
        val = src.get(key)
        if val is None or val == "":
            return default
        try:
            return float(val)
        except ValueError:
            return default

    # ── Interest → Label affinity map ──────────────────────────────────
    # Each interest boosts related prediction labels across all modes
    INTEREST_AFFINITY = {
        # Stream labels
        "Artificial Intelligence":    ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Machine Learning Engineer", "Data Scientist"],
        "Machine Learning":           ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "B.Sc in Data Science", "Machine Learning Engineer", "Data Scientist"],
        "Data Science":               ["Science Elective (PCM with Computer Science)", "B.Sc in Data Science", "Data Scientist", "Business Analyst", "Machine Learning Engineer"],
        "Web Development":            ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Diploma in Computer Engineering / IT", "Full Stack Engineer"],
        "Cybersecurity":              ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Cyber Security Analyst"],
        "Cloud Computing":            ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "DevOps Cloud Engineer"],
        "DevOps":                     ["Science Elective (PCM with Computer Science)", "Diploma in Computer Engineering / IT", "DevOps Cloud Engineer", "Full Stack Engineer"],
        "Blockchain":                 ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Full Stack Engineer", "Cyber Security Analyst"],
        "UI/UX":                      ["Arts with Humanities", "Professional Diploma in Digital Marketing & Design", "Full Stack Engineer", "Product/Project Manager"],
        "Software Development":       ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Diploma in Computer Engineering / IT", "Full Stack Engineer", "DevOps Cloud Engineer"],
        "Game Development":           ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Full Stack Engineer"],
        "Mobile Development":         ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Diploma in Computer Engineering / IT", "Full Stack Engineer"],
        "Networking":                 ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "DevOps Cloud Engineer", "Cyber Security Analyst"],
        "IoT":                        ["Science Elective (PCM with Computer Science)", "Science with Biology (PCB)", "DevOps Cloud Engineer"],
        "Embedded Systems":           ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "DevOps Cloud Engineer"],
        "Robotics":                   ["Science Elective (PCM with Computer Science)", "B.Tech in Computer Science & Engineering (AI/ML)", "Machine Learning Engineer"],
        # Commerce-related affinities
        "Finance":                    ["Commerce with Applied Math", "Chartered Accountancy (CA) / CS Program", "Bachelor of Commerce (B.Com Hons)", "Financial Analyst / Investment Banker", "Chartered Accountant (CA)", "Business Analyst"],
        "Marketing":                  ["Commerce with Applied Math", "Professional Diploma in Digital Marketing & Design", "Diploma in Business Administration (DBA)", "Marketing Executive", "Management Consultant"],
        "Management":                 ["Commerce with Applied Math", "Diploma in Business Administration (DBA)", "Product/Project Manager", "Management Consultant", "HR Specialist"],
    }

    INTEREST_BOOST = 0.12  # Boost factor per matching interest

    # Choose model
    if mode == "career" and current_education == "Undergraduate (Commerce)":
        model_name = "career_commerce_model.pkl"
    else:
        model_name = f"{mode}_model.pkl"

    if not os.path.exists(model_name):
        # Change dir to script directory to find pkl files
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_name = os.path.join(script_dir, model_name)

    if not os.path.exists(model_name):
        print(json.dumps({"error": f"Model file {model_name} not found"}))
        return

    try:
        model_data = load_model(model_name)
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
        return

    model = model_data["model"]
    features = model_data["features"]
    classes = model_data["classes"]

    # 1. Build input feature vector
    input_vector = []
    
    if mode == "stream":
        # Feature order: Math, Science, Social Science, English, Hindi, Computer Applications
        input_vector = [
            get_val(marks, "Mathematics", 75),
            get_val(marks, "Science", 75),
            get_val(marks, "Social Science", 70),
            get_val(marks, "English", 70),
            get_val(marks, "Hindi", 70),
            get_val(marks, "Computer Applications", 70)
        ]
    elif mode == "course":
        # Feature order: Math, Physics, Chemistry, English, CS, Bio, Acc, BS, Econ, Hindi
        input_vector = [
            get_val(marks, "Mathematics", 75),
            get_val(marks, "Physics", 75),
            get_val(marks, "Chemistry", 75),
            get_val(marks, "English", 70),
            get_val(marks, "Computer Science", 70),
            get_val(marks, "Biology", 70),
            get_val(marks, "Accountancy", 70),
            get_val(marks, "Business Studies", 70),
            get_val(marks, "Economics", 70),
            get_val(marks, "Hindi", 70)
        ]
    else: # career
        if current_education == "Undergraduate (Commerce)":
            # Feature order: 9 commerce college subjects, 5 programming skills, 5 soft skills
            input_vector = [
                # Commerce subjects
                get_val(marks, "Financial Accounting", 70),
                get_val(marks, "Corporate Laws", 70),
                get_val(marks, "Business Statistics", 70),
                get_val(marks, "Macroeconomics", 70),
                get_val(marks, "Cost Accounting", 70),
                get_val(marks, "Corporate Finance", 70),
                get_val(marks, "Auditing", 70),
                get_val(marks, "Marketing Management", 70),
                get_val(marks, "Human Resource Management", 70),
                # Programming skills
                get_val(prog, "Python", 40),
                get_val(prog, "Java", 30),
                get_val(prog, "C++", 30),
                get_val(prog, "JavaScript", 40),
                get_val(prog, "SQL", 50),
                # Soft skills
                get_val(soft, "Communication", 70),
                get_val(soft, "Leadership", 60),
                get_val(soft, "Problem Solving", 70),
                get_val(soft, "Critical Thinking", 60),
                get_val(soft, "Team Work", 70)
            ]
        else:
            # Feature order: 7 college subjects, 5 programming skills, 5 soft skills
            input_vector = [
                # College subjects
                get_val(marks, "Data Structures", 70),
                get_val(marks, "Operating Systems", 70),
                get_val(marks, "Database Management", 70),
                get_val(marks, "Machine Learning", 70),
                get_val(marks, "Artificial Intelligence", 70),
                get_val(marks, "Cloud Computing", 70),
                get_val(marks, "Cyber Security", 70),
                # Programming skills
                get_val(prog, "Python", 60),
                get_val(prog, "Java", 50),
                get_val(prog, "C++", 50),
                get_val(prog, "JavaScript", 60),
                get_val(prog, "SQL", 60),
                # Soft skills
                get_val(soft, "Communication", 70),
                get_val(soft, "Leadership", 60),
                get_val(soft, "Problem Solving", 70),
                get_val(soft, "Critical Thinking", 60),
                get_val(soft, "Team Work", 70)
            ]

    # Reshape for prediction
    X_input = np.array([input_vector])
    
    # 2. Run prediction
    pred_label = model.predict(X_input)[0]
    probabilities = model.predict_proba(X_input)[0]
    
    # 3. Apply interest-based probability boosting
    if interests and len(interests) > 0:
        boosted = list(probabilities)
        for i, cls_name in enumerate(classes):
            boost_count = 0
            for interest in interests:
                if interest in INTEREST_AFFINITY:
                    if cls_name in INTEREST_AFFINITY[interest]:
                        boost_count += 1
            if boost_count > 0:
                boosted[i] += INTEREST_BOOST * boost_count
        
        # Re-normalize so probabilities sum to 1
        total = sum(boosted)
        if total > 0:
            probabilities = np.array([b / total for b in boosted])
    
    # Pair classes with probabilities
    prob_pairs = sorted(zip(classes, probabilities), key=lambda x: x[1], reverse=True)
    
    primary_class = prob_pairs[0][0]
    primary_prob = prob_pairs[0][1]
    
    # Map colors for alternatives
    color_palette = ["#6366F1", "#10B981", "#818CF8", "#EC4899", "#F59E0B", "#3B82F6"]
    
    alternatives = []
    for idx, (name, prob) in enumerate(prob_pairs[1:]):
        alternatives.append({
            "name": name,
            "value": int(round(prob * 100)),
            "color": color_palette[idx % len(color_palette)]
        })

    # Limit to top 3 alternatives
    if mode == "stream":
        alternatives = alternatives[:3]
    else:
        alternatives = alternatives[:3]

    # Generate custom descriptions
    if mode == "stream":
        top_sub = "Mathematics" if get_val(marks, "Mathematics") >= get_val(marks, "Science") else "Science"
        top_score = max(get_val(marks, "Mathematics"), get_val(marks, "Science"))
        desc = f"Based on your academic performance, including {top_sub} ({int(top_score)}%) and Computer Applications ({int(get_val(marks, 'Computer Applications'))}%), our trained Random Forest model predicts '{primary_class}' as your optimal stream. This matches patterns of quantitative capability in the training dataset."
        radar = [
            {"subject": "Logical Math", "value": int(get_val(marks, "Mathematics")), "fullMark": 100},
            {"subject": "Science Aptitude", "value": int(get_val(marks, "Science")), "fullMark": 100},
            {"subject": "Languages", "value": int(round((get_val(marks, "English") + get_val(marks, "Hindi")) / 2)), "fullMark": 100},
            {"subject": "Creativity", "value": int(get_val(marks, "Computer Applications")), "fullMark": 100},
            {"subject": "Analytical", "value": int(round((get_val(marks, "Mathematics") + get_val(marks, "Science")) / 2)), "fullMark": 100}
        ]
    elif mode == "course":
        # Find top 2 subjects from all 12th subjects
        subj_list = [
            ("Mathematics", get_val(marks, "Mathematics")),
            ("Physics", get_val(marks, "Physics")),
            ("Chemistry", get_val(marks, "Chemistry")),
            ("English", get_val(marks, "English")),
            ("Computer Science", get_val(marks, "Computer Science")),
            ("Biology", get_val(marks, "Biology")),
            ("Accountancy", get_val(marks, "Accountancy")),
            ("Business Studies", get_val(marks, "Business Studies")),
            ("Economics", get_val(marks, "Economics")),
            ("Hindi", get_val(marks, "Hindi"))
        ]
        # Sort descending by mark value
        sorted_subjs = sorted(subj_list, key=lambda x: x[1], reverse=True)
        top1_name, top1_val = sorted_subjs[0]
        top2_name, top2_val = sorted_subjs[1]
        
        desc = f"Recommended post-12th course/professional path. The ML model identified high correlation in your scores for {top1_name} ({int(top1_val)}%) and {top2_name} ({int(top2_val)}%), aligning with optimal candidate profiles for {primary_class}."
        
        radar = [
            {"subject": "Math & Stats", "value": int(get_val(marks, "Mathematics")), "fullMark": 100},
            {"subject": "Computer Fundamentals", "value": int(get_val(marks, "Computer Science")), "fullMark": 100},
            {"subject": "Physics Core", "value": int(get_val(marks, "Physics")), "fullMark": 100},
            {"subject": "Logical Deductions", "value": int(round((get_val(marks, "Mathematics") + get_val(marks, "Computer Science")) / 2)), "fullMark": 100},
            {"subject": "Communication", "value": int(get_val(marks, "English")), "fullMark": 100}
        ]
    else: # career
        if current_education == "Undergraduate (Commerce)":
            desc = f"Identified as your highest-matching career path. Backed by solid qualitative and numerical foundations including Business Statistics ({int(get_val(marks, 'Business Statistics'))}%), Problem Solving ({int(get_val(soft, 'Problem Solving'))}%), and university commerce course scores."
            
            fin_acc = get_val(marks, "Financial Accounting")
            corp_law = get_val(marks, "Corporate Laws")
            bus_stat = get_val(marks, "Business Statistics")
            corp_fin = get_val(marks, "Corporate Finance")
            
            radar = [
                {"subject": "Finance & Accounting", "value": int(round((fin_acc + corp_fin) / 2)), "fullMark": 100},
                {"subject": "Legal & Corporate", "value": int(corp_law), "fullMark": 100},
                {"subject": "Aptitude & Stats", "value": int(bus_stat), "fullMark": 100},
                {"subject": "Soft Skills", "value": int(round((get_val(soft, "Communication") + get_val(soft, "Leadership") + get_val(soft, "Team Work")) / 3)), "fullMark": 100},
                {"subject": "Economics & Audit", "value": int(round((get_val(marks, "Macroeconomics") + get_val(marks, "Auditing")) / 2)), "fullMark": 100}
            ]
        else:
            avg_prog = (get_val(prog, "Python") + get_val(prog, "Java") + get_val(prog, "C++") + get_val(prog, "JavaScript")) / 4
            desc = f"Identified as the highest-matching career path. Backed by solid technical foundation including Programming ({int(round(avg_prog))}%), Problem Solving ({int(get_val(soft, 'Problem Solving'))}%), and university specialization course scores."
            
            ml_v = get_val(marks, "Machine Learning")
            ai_v = get_val(marks, "Artificial Intelligence")
            cl_v = get_val(marks, "Cloud Computing")
            cy_v = get_val(marks, "Cyber Security")
            
            radar = [
                {"subject": "Algorithms & Dev", "value": int(round((get_val(prog, "Python") + get_val(prog, "Java") + get_val(prog, "JavaScript")) / 3)), "fullMark": 100},
                {"subject": "Applied Systems", "value": int(round((get_val(marks, "Data Structures") + get_val(marks, "Operating Systems")) / 2)), "fullMark": 100},
                {"subject": "Soft Skills", "value": int(round((get_val(soft, "Communication") + get_val(soft, "Leadership") + get_val(soft, "Team Work")) / 3)), "fullMark": 100},
                {"subject": "Databases (SQL)", "value": int(get_val(prog, "SQL")), "fullMark": 100},
                {"subject": "Specialization", "value": int(max(ml_v, ai_v, cl_v, cy_v)), "fullMark": 100}
            ]

    # Build response JSON
    response = {
        "predictionName": primary_class,
        "confidence": format_percentage(primary_prob),
        "desc": desc,
        "alternatives": alternatives,
        "radar": radar
    }
    
    print(json.dumps(response))

if __name__ == "__main__":
    predict()
