import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler

def train_and_save_model(df, features, target_col, save_path, mode_name):
    print(f"\nTraining {mode_name} model...")
    
    X = df[features]
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features for Logistic Regression and KNN
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Define candidate models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "Random Forest": RandomForestClassifier(n_estimators=50, random_state=42, max_depth=10),
    }
    
    best_model_name = None
    best_model = None
    best_accuracy = 0
    best_scaler = None
    
    for name, model in models.items():
        # Use scaled data for LR and KNN, raw for Random Forest
        if name == "Random Forest":
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
        else:
            model.fit(X_train_scaled, y_train)
            preds = model.predict(X_test_scaled)
        
        acc = accuracy_score(y_test, preds)
        print(f"[{mode_name}] {name} accuracy: {acc*100:.2f}%")
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            best_model_name = name
            best_scaler = scaler if name != "Random Forest" else None
    
    print(f"[{mode_name}] Best model: {best_model_name} ({best_accuracy*100:.2f}%)")
    
    # Save best model, feature list, scaler, and metadata
    model_data = {
        "model": best_model,
        "features": features,
        "classes": list(best_model.classes_),
        "model_name": best_model_name,
        "accuracy": best_accuracy,
        "scaler": best_scaler,  # None for Random Forest
    }
    
    with open(save_path, "wb") as f:
        pickle.dump(model_data, f)
    print(f"[{mode_name}] Saved model to {save_path}")

def main():
    print("Loading and preprocessing data...")
    df = pd.read_csv("student_dataset.csv")
    
    # 1. Train Stream prediction model
    stream_features = [
        "Mathematics_10th", "Science_10th", "Social_Science_10th", 
        "English_10th", "Hindi_10th", "Computer_Applications_10th"
    ]
    df_stream = df[df["mode"] == "stream"]
    train_and_save_model(df_stream, stream_features, "label", "stream_model.pkl", "stream")
    
    # 2. Train Course prediction model
    course_features = [
        "Mathematics_12th", "Physics_12th", "Chemistry_12th", "English_12th", 
        "Computer_Science_12th", "Biology_12th", "Accountancy_12th", 
        "Business_Studies_12th", "Economics_12th", "Hindi_12th"
    ]
    df_course = df[df["mode"] == "course"]
    train_and_save_model(df_course, course_features, "label", "course_model.pkl", "course")
    
    # 3. Train Career prediction model (Science/Tech)
    career_features = [
        "Data_Structures", "Operating_Systems", "Database_Management", 
        "Machine_Learning", "Artificial_Intelligence", "Cloud_Computing", "Cyber_Security",
        "Python", "Java", "C_plus_plus", "JavaScript", "SQL",
        "Communication", "Leadership", "Problem_Solving", "Critical_Thinking", "Team_Work"
    ]
    df_career = df[df["mode"] == "career"]
    train_and_save_model(df_career, career_features, "label", "career_model.pkl", "career")

    # 4. Train Career prediction model (Commerce)
    career_commerce_features = [
        "Financial_Accounting", "Corporate_Laws", "Business_Statistics", 
        "Macroeconomics", "Cost_Accounting", "Corporate_Finance", 
        "Auditing", "Marketing_Management", "Human_Resource_Management",
        "Python", "Java", "C_plus_plus", "JavaScript", "SQL",
        "Communication", "Leadership", "Problem_Solving", "Critical_Thinking", "Team_Work"
    ]
    df_career_commerce = df[df["mode"] == "career_commerce"]
    train_and_save_model(df_career_commerce, career_commerce_features, "label", "career_commerce_model.pkl", "career_commerce")

    print("\nAll models trained and saved successfully.")

if __name__ == "__main__":
    main()
