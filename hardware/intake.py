import os
from datetime import datetime, timedelta
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
    current_date = current_time.date()
    current_hour = current_time.hour

    try:
        with connect_to_database() as conn:
            cursor = conn.cursor()

            # Update entries scheduled for the current hour
            current_hour_query = '''
            UPDATE "IntakeLog"
            SET "intakeTime" = %s, "isIntaked" = True, "status" = 'Completed'
            WHERE EXTRACT(HOUR FROM TO_TIMESTAMP(%s || ' ' || "scheduleTime", 'YYYY-MM-DD HH24:MI')) = %s
            '''
            cursor.execute(current_hour_query, (current_time, current_date, current_hour))

            # Find the nearest previous group
            previous_group_hour_query = '''
            SELECT MAX(EXTRACT(HOUR FROM TO_TIMESTAMP(%s || ' ' || "scheduleTime", 'YYYY-MM-DD HH24:MI')))
            FROM "IntakeLog"
            WHERE EXTRACT(HOUR FROM TO_TIMESTAMP(%s || ' ' || "scheduleTime", 'YYYY-MM-DD HH24:MI')) < %s
            '''
            cursor.execute(previous_group_hour_query, (current_date, current_date, current_hour))
            previous_group_hour = cursor.fetchone()[0]

            if previous_group_hour is not None:
                previous_group_query = '''
                UPDATE "IntakeLog"
                SET "intakeTime" = %s, "isIntaked" = True, "status" = 'Completed'
                WHERE EXTRACT(HOUR FROM TO_TIMESTAMP(%s || ' ' || "scheduleTime", 'YYYY-MM-DD HH24:MI')) = %s
                '''
                cursor.execute(previous_group_query, (current_time, current_date, previous_group_hour))

                # Mark older entries as "Missed"
                older_entries_query = '''
                UPDATE "IntakeLog"
                SET "status" = 'Missed'
                WHERE EXTRACT(HOUR FROM TO_TIMESTAMP(%s || ' ' || "scheduleTime", 'YYYY-MM-DD HH24:MI')) < %s
                '''
                cursor.execute(older_entries_query, (current_date, previous_group_hour))

            conn.commit()

    except Exception as error:
        print("Error updating intake log in database:", error)
        conn.rollback()
