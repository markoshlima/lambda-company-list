Lambda CompanySave: Saves a company from a new or existing data<br /><br />

#invoking lambda AWS from localhost<br />
aws lambda invoke --function-name {FUNCTION_NAME}:prd --cli-binary-format raw-in-base64-out --payload file://run/request.json run/response.json && cat run/response.json
<br /><br />
#invoking lambda localhost<br />
python-lambda-local src/lambda_function.py -f lambda_handler run/request.json -e run/variables.json
<br /><br />
#packing into localhost, validade the template and generate the output.yml<br />
sam package --output-template-file output.yaml --s3-bucket {BUCKET_NAME}
<br /><br />
#publish into Serverless Application Repository (SAR)<br />
sam publish --template output.yaml --region sa-east-1
<br /><br />
#first time<br />
sam deploy --guided<br />
#other times<br />
sam deploy
