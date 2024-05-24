import os
from datetime import datetime
from dotenv import load_dotenv, find_dotenv
from azure import connect_to_database

# Load environment variables from .env file
load_dotenv(find_dotenv())

# Database connection information
dbname = os.getenv("DATABASE")
user = "chelsey"
password = os.getenv("PASSWORD")
host = os.getenv("HOST")
port = os.getenv("PORT")

def fetch_daily_intake_schedule():
    try:
        with connect_to_database() as conn:
            cursor = conn.cursor()

            date = str(datetime.now().date())
            query = '''
            SELECT "intakeTime", "isIntaked", "scheduleTime", "scheduleDate", "status", "pillName", "caseNo", "doses"
            FROM "IntakeLog"
            WHERE "scheduleDate" = %s
            ORDER BY CAST("scheduleTime" AS TIME)
            '''
            cursor.execute(query, (date,))
            
            columns = [desc[0] for desc in cursor.description if desc[0] != "pillcaseId"]
            rows = cursor.fetchall()
            schedule = [dict(zip(columns, row)) for row in rows]

            return schedule

    except Exception as error:
        print("Error fetching daily intake schedule:", error)

def update_intake_log():
    current_time = datetime.now()
    current_hour = current_time.hour

    try:
        with connect_to_database() as conn:
            cursor = conn.cursor()

            query = '''
            UPDATE "IntakeLog"
            SET "intakeTime" = %s, "isIntaked" = True, "status" = %s
            WHERE "status" = %s
            AND %s >= ANY(ARRAY(SELECT EXTRACT(HOUR FROM unnest("scheduleTime"))::INTEGER))
            '''
            cursor.execute(query, (current_hour, 'Completed', 'Pending', current_hour))

            conn.commit()

    except Exception as error:
        print("Error updating intake log:", error)
        conn.rollback()