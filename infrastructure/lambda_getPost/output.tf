

output "function_name" {
  description = "Name of the Lambda function."
  value = aws_lambda_function.lambda_get_post.function_name
}