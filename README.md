# MotionSense - Human Activity Recognition System

A machine learning system that classifies human activities from smartphone sensor data using signal processing and AI.
## RehabTracker-MotionSense AI
contains detailed project description 

## Project Structure

### motion-sense/notebooks
Contains the Jupyter notebook we used to train and develop the machine learning model.

### motion-sense/backend  
Contains the FastAPI server and signal processing pipeline:
- `api.py` - Main API endpoints for activity prediction
- `har_utils.py` - Feature extraction and signal processing functions
- `requirements.txt` - Python dependencies

### motion-sense/frontend
React TypeScript user interface for uploading data and viewing results.

## Data Format

Upload CSV/TXT files with 6 columns in this exact order:

1. **acc_x** - Accelerometer X-axis
2. **acc_y** - Accelerometer Y-axis  
3. **acc_z** - Accelerometer Z-axis
4. **gyro_x** - Gyroscope X-axis
5. **gyro_y** - Gyroscope Y-axis
6. **gyro_z** - Gyroscope Z-axis

### Model Performance
Trained on UCI HAR Dataset

540 feature engineering pipeline

## Supported Activities{
WALKING

STANDING

SITTING

LAYING

WALKING_UPSTAIRS

WALKING_DOWNSTAIRS}

## Setup Instructions

### Backend Installation
```bash
cd motion-sense/backend
pip install -r requirements.txt
python api.py
