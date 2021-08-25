

output "function_name" {
  description = "Name of the Lambda function."
  value = aws_lambda_function.lambda_publish_post.function_name
}

output "sqs_publish_post_queue_arn" {
  type    = string
  description = "The SQS Arn for publish the posts."
  value = aws_sqs_queue.sqs_publish_post.arn
}