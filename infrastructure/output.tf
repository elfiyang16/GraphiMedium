# output "lambda_getPost_bucket_name" {
#   description = "Name of the getpost S3 bucket used to store function code."
#   value       = module.lambda_getPost.function_name
# }

output "lambda_getPost_function_name" {
  description = "Name of the getPost Lambda function."
  value       = module.lambda_getPost.function_name
}
