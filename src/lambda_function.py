import json
import os
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', endpoint_url="http://dynamodb.sa-east-1.amazonaws.com")

def lambda_handler(event, context):

    parameters = event['pathParameters']

    if 'company_id'not in parameters or parameters['company_id'] is "":
        return messageCallBack(400, "ID da empresa invalido")
    else:
        resp = get_item(parameters['company_id'])
        print("resultado da busca")
        print(resp)
        if resp == False:
            return messageCallBack(204, "Registro inexistente")
        else:    
            return messageCallBack(200, resp)

def get_item(key):

    if key == 'uuid-testing':
        print("Key test:")
        return getDataCompany()

    try:
        table = dynamodb.Table(os.environ['TABLE'])
        print("Lendo item da tabela: "+os.environ['TABLE'])
        print(key)
        resp = table.get_item(Key={'company_id':key})
        if 'Item'not in resp:
            return False
        return resp['Item']
    except Exception as e:
        print (e)
        raise Exception('Failed to get_item in dynamodb')

def messageCallBack(status, message):
    return {
        'statusCode': status,
        'body': json.dumps(message, cls=DecJSONEncoder)
    }

class DecJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        else:
            return super().default(obj)

def getDataCompany():
    return {
            "company_id":"uuid-testing",
            "name":"Petroleo Brasileiro SA Petrobras Preference Shares",
            "bvmf":"PETR4",
            "local":"Rio de Janeiro/RJ Brazil",
            "employees":45532,
            "description":"Petróleo Brasileiro S.A. é uma empresa de capital aberto, cujo acionista majoritário é o Governo do Brasil, sendo, portanto, uma empresa estatal de economia mista"
        }