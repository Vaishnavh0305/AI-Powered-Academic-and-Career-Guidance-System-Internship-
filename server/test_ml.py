import json
import subprocess

def run_test(payload):
    process = subprocess.Popen(
        ["python", "predict.py"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = process.communicate(input=json.dumps(payload))
    if process.returncode != 0:
        print(f"Error: {stderr}")
        return None
    return json.loads(stdout)

def main():
    print("=== Testing ML Model Predictions ===\n")

    # Test 1: Class 10 Stream (Math/Sci Bias)
    p1 = {
        "mode": "stream",
        "marks": {
            "Mathematics": 95,
            "Science": 92,
            "Social Science": 50,
            "English": 60,
            "Hindi": 60,
            "Computer Applications": 90
        }
    }
    res1 = run_test(p1)
    print("Test 1: Math/Science focus (Class 10)")
    print(f"Predicted Stream: {res1.get('predictionName')}")
    print(f"Confidence: {res1.get('confidence')}")
    print(f"Alternatives: {[a['name'] for a in res1.get('alternatives', [])]}")
    print(f"Description: {res1.get('desc')}\n")

    # Test 2: Class 10 Stream (Arts Bias)
    p2 = {
        "mode": "stream",
        "marks": {
            "Mathematics": 45,
            "Science": 50,
            "Social Science": 92,
            "English": 88,
            "Hindi": 85,
            "Computer Applications": 50
        }
    }
    res2 = run_test(p2)
    print("Test 2: Social Science/Languages focus (Class 10)")
    print(f"Predicted Stream: {res2.get('predictionName')}")
    print(f"Confidence: {res2.get('confidence')}")
    print(f"Alternatives: {[a['name'] for a in res2.get('alternatives', [])]}")
    print(f"Description: {res2.get('desc')}\n")

    # Test 3: Class 12 Course (Medical Bias)
    p3 = {
        "mode": "course",
        "marks": {
            "Mathematics": 50,
            "Physics": 78,
            "Chemistry": 85,
            "English": 70,
            "Biology": 96,
            "Computer Science": 40,
            "Accountancy": 40,
            "Business Studies": 40,
            "Economics": 40,
            "Hindi": 60
        }
    }
    res3 = run_test(p3)
    print("Test 3: Biology/Chemistry focus (Class 12)")
    print(f"Predicted Course: {res3.get('predictionName')}")
    print(f"Confidence: {res3.get('confidence')}")
    print(f"Alternatives: {[a['name'] for a in res3.get('alternatives', [])]}")
    print(f"Description: {res3.get('desc')}\n")

    # Test 4: Class 12 Course (Commerce Bias)
    p4 = {
        "mode": "course",
        "marks": {
            "Mathematics": 75,
            "Physics": 40,
            "Chemistry": 40,
            "English": 80,
            "Biology": 40,
            "Computer Science": 40,
            "Accountancy": 95,
            "Business Studies": 92,
            "Economics": 88,
            "Hindi": 70
        }
    }
    res4 = run_test(p4)
    print("Test 4: Commerce/Accountancy focus (Class 12)")
    print(f"Predicted Course: {res4.get('predictionName')}")
    print(f"Confidence: {res4.get('confidence')}")
    print(f"Alternatives: {[a['name'] for a in res4.get('alternatives', [])]}")
    print(f"Description: {res4.get('desc')}\n")

    # Test 5: Career (AI/ML Bias)
    p5 = {
        "mode": "career",
        "marks": {
            "Machine Learning": 95,
            "Artificial Intelligence": 92,
            "Data Structures": 85,
            "Operating Systems": 70
        },
        "programmingSkills": {
            "Python": 90,
            "SQL": 80
        },
        "softSkills": {
            "Problem Solving": 90,
            "Communication": 75
        }
    }
    res5 = run_test(p5)
    print("Test 5: AI/ML & Python focus (College)")
    print(f"Predicted Career: {res5.get('predictionName')}")
    print(f"Confidence: {res5.get('confidence')}")
    print(f"Alternatives: {[a['name'] for a in res5.get('alternatives', [])]}")
    print(f"Description: {res5.get('desc')}\n")

    # Test 6: Career (Leadership/PM Bias)
    p6 = {
        "mode": "career",
        "marks": {
            "Machine Learning": 40,
            "Cyber Security": 50
        },
        "programmingSkills": {
            "Python": 50,
            "JavaScript": 60
        },
        "softSkills": {
            "Leadership": 95,
            "Communication": 90,
            "Team Work": 92,
            "Problem Solving": 75
        }
    }
    res6 = run_test(p6)
    print("Test 6: Leadership/Communication focus (College)")
    print(f"Predicted Career: {res6.get('predictionName')}")
    print(f"Confidence: {res6.get('confidence')}")
    print(f"Alternatives: {[a['name'] for a in res6.get('alternatives', [])]}")
    print(f"Description: {res6.get('desc')}\n")

    # Test 7: Career Commerce (Finance/Banking Bias)
    p7 = {
        "mode": "career",
        "currentEducation": "Undergraduate (Commerce)",
        "marks": {
            "Financial Accounting": 95,
            "Corporate Finance": 92,
            "Business Statistics": 88,
            "Macroeconomics": 85
        },
        "programmingSkills": {
            "SQL": 70
        },
        "softSkills": {
            "Problem Solving": 85,
            "Communication": 80
        }
    }
    res7 = run_test(p7)
    print("Test 7: Undergraduate Commerce - Finance/Banking focus")
    print(f"Predicted Career: {res7.get('predictionName')}")
    print(f"Confidence: {res7.get('confidence')}")
    print(f"Alternatives: {[a['name'] for a in res7.get('alternatives', [])]}")
    print(f"Description: {res7.get('desc')}\n")

    # Test 8: Same marks as Test 6 but WITH Cybersecurity + Cloud interest
    p8 = {
        "mode": "career",
        "marks": {
            "Machine Learning": 40,
            "Cyber Security": 50
        },
        "programmingSkills": {
            "Python": 50,
            "JavaScript": 60
        },
        "softSkills": {
            "Leadership": 95,
            "Communication": 90,
            "Team Work": 92,
            "Problem Solving": 75
        },
        "interests": ["Cybersecurity", "Cloud Computing"]
    }
    res8 = run_test(p8)
    print("Test 8: Same as Test 6 + interests [Cybersecurity, Cloud Computing]")
    print(f"Predicted Career: {res8.get('predictionName')}")
    print(f"Confidence: {res8.get('confidence')}")
    print(f"Alternatives: {[a['name'] for a in res8.get('alternatives', [])]}")
    print(f"Description: {res8.get('desc')}\n")

if __name__ == "__main__":
    main()
