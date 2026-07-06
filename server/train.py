import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def train_and_save_model(df, features, target_col, save_path):
    print(f"\nTraining model for {save_path} using features: {features}")
    
    # Filter rows that actually have data for this mode
    df_mode = df[df["mode"] == df["mode"].iloc[0]] # Just double checks mode column
    
    X = df_mode[features]
    y = df_mode[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train random forest
    model = RandomForestClassifier(n_estimators=50, random_state=42, max_depth=10)
    model.fit(X_train, y_train)
    
    # Predict and show accuracy
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Model Accuracy: {acc*100:.2f}%")
    
    # Save model and feature list together as a dictionary
    model_data = {
        "model": model,
        "features": features,
        "classes": list(model.classes_)
    }
    
    with open(save_path, "wb") as f:
        pickle.dump(model_data, f)
    print(f"Model saved successfully to {save_path}")

def main():
    print("Loading student dataset...")
    df = pd.read_csv("student_dataset.csv")
    
    # 1. Train Stream prediction model
    stream_features = [
        "Mathematics_10th", "Science_10th", "Social_Science_10th", 
        "English_10th", "Hindi_10th", "Computer_Applications_10th"
    ]
    df_stream = df[df["mode"] == "stream"]
    train_and_save_model(df_stream, stream_features, "label", "stream_model.pkl")
    
    # 2. Train Course prediction model
    course_features = [
        "Mathematics_12th", "Physics_12th", "Chemistry_12th", "English_12th", 
        "Computer_Science_12th", "Biology_12th", "Accountancy_12th", 
        "Business_Studies_12th", "Economics_12th", "Hindi_12th"
    ]
    df_course = df[df["mode"] == "course"]
    train_and_save_model(df_course, course_features, "label", "course_model.pkl")
    
    # 3. Train Career prediction model (Science/Tech)
    career_features = [
        "Data_Structures", "Operating_Systems", "Database_Management", 
        "Machine_Learning", "Artificial_Intelligence", "Cloud_Computing", "Cyber_Security",
        "Python", "Java", "C_plus_plus", "JavaScript", "SQL",
        "Communication", "Leadership", "Problem_Solving", "Critical_Thinking", "Team_Work"
    ]
    df_career = df[df["mode"] == "career"]
    train_and_save_model(df_career, career_features, "label", "career_model.pkl")

    # 4. Train Career prediction model (Commerce)
    career_commerce_features = [
        "Financial_Accounting", "Corporate_Laws", "Business_Statistics", 
        "Macroeconomics", "Cost_Accounting", "Corporate_Finance", 
        "Auditing", "Marketing_Management", "Human_Resource_Management",
        "Python", "Java", "C_plus_plus", "JavaScript", "SQL",
        "Communication", "Leadership", "Problem_Solving", "Critical_Thinking", "Team_Work"
    ]
    df_career_commerce = df[df["mode"] == "career_commerce"]
    train_and_save_model(df_career_commerce, career_commerce_features, "label", "career_commerce_model.pkl")

if __name__ == "__main__":
    main()
