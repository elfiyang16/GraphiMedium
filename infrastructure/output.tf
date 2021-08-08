# output "lambda_role_name" {
#   value = aws_iam_role.lambda_role.name
# }

# output "lambda_role_arn" {
#   value = aws_iam_role.lambda_role.arn
# }

# output "aws_iam_policy_lambda_logging_arn" {
#   value = aws_iam_policy.lambda_logging.arn
# }
output "lambda_bucket_name" {
  description = "Name of the S3 bucket used to store function code."
  value = aws_s3_bucket.lambda_bucket.id
}

output "function_name" {
  description = "Name of the Lambda function."
  value = aws_lambda_function.lambda_medium_contentful.function_name
}