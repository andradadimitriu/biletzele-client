import boto3

dynamodb = boto3.client('dynamodb')

try:
    dynamodb.delete_table(TableName='biletzele')
    print("Table biletzele deleted successfully.")
except Exception as e:
    print("Could not delete table biletzele. Please try again in a moment. Error:")
    print(e)
