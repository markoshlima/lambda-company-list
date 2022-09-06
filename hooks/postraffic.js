const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({apiVersion: '2014-10-06'});
const lambda = new aws.Lambda();

exports.handler = (event, context, callback) => {

    //Read the DeploymentId from the event payload.
    let deploymentId = event.DeploymentId;

    //Read the LifecycleEventHookExecutionId from the event payload
    let lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

    //function to do the integration test
    let functionTestIntegration = "arn:aws:lambda:sa-east-1:{ACCOUNT_ID}:function:testIntegrationCompany";

    let lambdaParams = {
        FunctionName: functionTestIntegration,
        InvocationType: "RequestResponse"
    };
    console.log(lambdaParams)

    let lambdaResult = "Failed";

    lambda.invoke(lambdaParams, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            lambdaResult = "Failed";
        } else {
            let payload = JSON.parse(data.Payload)
            console.log("Result: " + JSON.stringify(payload));
            
            if (payload['body'] == "SUCCEEDED" && payload['statusCode'] == 200) {
                lambdaResult = "Succeeded";
                console.log("Validation testing succeeded!");
            } else {
                lambdaResult = "Failed";
                console.log("Validation testing failed!");
            }

            // Complete the PosTraffic Hook by sending CodeDeploy the validation status
            let params = {
                deploymentId: deploymentId,
                lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
                status: lambdaResult // status can be 'Succeeded' or 'Failed'
            };
            console.log(params)

            // Pass AWS CodeDeploy the prepared validation test results.
            codedeploy.putLifecycleEventHookExecutionStatus(params, function (err) {
                if (err) {
                    console.log('CodeDeploy Status update failed');
                    console.log(err, err.stack);
                    callback("CodeDeploy Status update failed");
                } else {
                    console.log('Codedeploy status updated successfully');
                    callback(null, 'Codedeploy status updated successfully');
                }
            });
        }
    });
}