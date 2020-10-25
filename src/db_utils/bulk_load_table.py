import json

import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('biletzele')

items = []

with open('biletzele.json', 'r') as f:
        items = json.loads(f)

with table.batch_writer() as batch:
    for item in items:
        batch.put_item(Item=item)
