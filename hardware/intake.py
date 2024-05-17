import os
import psycopg2
from dotenv import load_dotenv, find_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv(find_dotenv())

# Database connection information
dbname = os.getenv("DATABASE")
user = "chelsey"
password = os.getenv("PASSWORD")
host = os.getenv("HOST")
port = os.getenv("PORT")

def connect_to_database():
    return psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)

def fetch_daily_intake_schedule():
    conn = None
    try:
        conn = connect_to_database()
        cursor = conn.cursor()

        date = str(datetime.now().date())
        query = 'SELECT "pillcaseId", "intakeTime", "isIntaked", "updatedAt", "userId", "scheduleTime", "scheduleDate", "status" FROM "IntakeLog" WHERE "scheduleDate" = %s'
        cursor.execute(query, (date,))
        
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        schedule = [dict(zip(columns, row)) for row in rows]

        return schedule

    except (Exception, psycopg2.Error) as error:
        print("Error fetching daily intake schedule:", error)
    finally:
        if conn:
            cursor.close()
            conn.close()

def remind_to_take_pills(schedule):
    for entry in schedule:
        pillcase_id = entry['pillcaseId']
        schedule_time = entry['scheduleTime']
        pill_info = get_pillcase_info(pillcase_id)
        if pill_info and str(datetime.now().time().strftime('%H:%M')) in schedule_time:
            pill_name, doses, case_no = pill_info
            reminder_message = f"Take {doses} dose(s) of {pill_name} from pillbox {case_no}"
            print(reminder_message)
            play_audio_reminder("Time to take your medicines!")

def get_pillcase_info(pillcase_id):
    conn = None
    try:
        conn = connect_to_database()
        cursor = conn.cursor()

        query = 'SELECT "pillName", "doses", "caseNo" FROM "Pillcase" WHERE id = %s'
        cursor.execute(query, (pillcase_id,))
        pill_info = cursor.fetchone()

        return pill_info

    except (Exception, psycopg2.Error) as error:
        print("Error fetching pillcase info:", error)
    finally:
        if conn:
            cursor.close()
            conn.close()

def play_audio_reminder(message):
    # Implement audio reminder functionality
    pass

def update_intake_log(pillcase_id, intake_time):
    conn = None
    try:
        conn = connect_to_database()
        cursor = conn.cursor()

        query = 'UPDATE "IntakeLog" SET intakeTime = %s, isIntaked = True, status = %s WHERE pillcaseId = %s AND scheduleTime = %s'
        cursor.execute(query, (intake_time, pillcase_id, intake_time))

        conn.commit()

    except (Exception, psycopg2.Error) as error:
        print("Error updating intake log:", error)
        if conn:
            conn.rollback()
    finally:
        if conn:
            cursor.close()
            conn.close()