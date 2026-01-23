from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pandas as pd

# Mock data for initial testing if DB is empty or simple
# In production, this would fetch from DB
def get_recommendations(book_id, all_books):
    if not all_books:
        return []

    # Create DataFrame
    df = pd.DataFrame([b.__dict__ for b in all_books])
    
    # Simple Content-Based Filtering on Genre and Description (if we had it, using Title/Genre here)
    # Combine features
    df['combined_features'] = df['genre'].fillna('') + " " + df['author'].fillna('') + " " + df['title'].fillna('')

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])

    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Get index of the book
    try:
        idx = df.index[df['id'] == book_id].tolist()[0]
    except IndexError:
        return []

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6] # Top 5 similar, skipping self

    book_indices = [i[0] for i in sim_scores]
    return df.iloc[book_indices].to_dict('records')
