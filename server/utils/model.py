import pickle

def load(file_path):
    with open(file_path, "rb") as file:
        return pickle.load(file)

# import model
cv = load("../model/cv.pkl")
le = load("../model/le.pkl")
classifier = load("../model/classifier.pkl")

def predict(description):
    import re
    description = re.sub(r"[^a-zA-Z]", " ", description).lower()
    description = cv.transform([description]).toarray()
    return le.inverse_transform(classifier.predict(description))[0]
