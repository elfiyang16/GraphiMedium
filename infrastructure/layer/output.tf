
output "lambda_node_modules_layer_arn" {
  description = "Arn of the lambda node modules layer."
  value = aws_lambda_layer_version.lambda_node_modules_layer.arn
}

output "lambda_shared_layer_arn" {
  description = "Arn of the lambda shared layer."
  value = aws_lambda_layer_version.lambda_shared_layer.arn
}