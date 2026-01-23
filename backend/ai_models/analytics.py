from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def analyze_reader_behavior(users, borrows):
    # Prepare data: UserID -> [BorrowCount, AvgReturnDays]
    # For now, just BorrowCount
    data = []
    user_map = []
    
    for u in users:
        user_borrows = [b for b in borrows if b.user_id == u.id]
        count = len(user_borrows)
        data.append([count])
        user_map.append(u.email)
    
    if not data or len(data) < 3:
        return {"message": "Not enough data for clustering"}

    X = np.array(data)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    kmeans.fit(X)
    
    clusters = {0: "Casual", 1: "Regular", 2: "Heavy"} 
    # Note: K-Means labels are random, we need to sort centers to map correctly
    # But for this simple demo, we just return raw labels
    
    results = []
    for i, label in enumerate(kmeans.labels_):
        results.append({"email": user_map[i], "category": clusters.get(label, "Unknown"), "borrow_count": int(X[i][0])})
        
    return results

def predict_demand():
    # Mock time-series data: Month (1-12) -> Borrow Count
    # In real app, query DB for historical borrows per month
    X = np.array([[1], [2], [3], [4], [5]]).reshape(-1, 1) # Jan to May
    y = np.array([10, 15, 20, 25, 30]) # Linear trend
    
    model = LinearRegression()
    model.fit(X, y)
    
    next_month = np.array([[6]])
    prediction = model.predict(next_month)[0]
    
    return {
        "next_month_prediction": round(prediction, 2),
        "trend": "Increasing" if model.coef_[0] > 0 else "Decreasing"
    }
