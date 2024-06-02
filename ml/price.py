import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
from sqlalchemy import create_engine

# Create a SQLAlchemy engine
engine = create_engine('mysql+mysqlconnector://root:root123@localhost/liftlink')

# Load data from SQL database
query = "SELECT * FROM learn"
data = pd.read_sql(query, engine)

# Feature engineering
# Example: Extracting day of the week from the date
data['date'] = pd.to_datetime(data['date'])
data['weekday'] = data['date'].dt.weekday

# Define features and target variable
X = data[['cartype', 'ac', 'distance', 'weekday', 'drivingexp', 'rating']]
y = data['price']

# Apply one-hot encoding to 'cartype' column
# Create the column transformer with one-hot encoding for 'cartype'
column_transformer = ColumnTransformer(
    transformers=[
        ('cartype', OneHotEncoder(), ['cartype'])
    ],
    remainder='passthrough'  # Keep the rest of the columns as they are
)

# Define the pipeline with column transformer and the model
pipeline = Pipeline(steps=[
    ('preprocessor', column_transformer),
    ('model', RandomForestRegressor(n_estimators=100, random_state=42))
])

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
pipeline.fit(X_train, y_train)

# Evaluate the model
train_score = pipeline.score(X_train, y_train)
test_score = pipeline.score(X_test, y_test)
print(f"Training R^2 score: {train_score:.2f}")
print(f"Testing R^2 score: {test_score:.2f}")

# Save the model
joblib.dump(pipeline, 'price.pkl')
print("Model saved successfully!")
