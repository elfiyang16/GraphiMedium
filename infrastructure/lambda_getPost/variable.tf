variable "lambda_get_post_bucket" {
  type        = string
  description = "The bucket name for get post lambda."
}

variable "aws_region" {
  type        = string
  description = "AWS Region for SNS."
}

variable "aws_account_id" {
  type        = string
  description = "The aws account id"
}

variable "sns_send_post_topic_name" {
  type        = string
  description = "The SNS name for sending the posts."
}

variable "sqs_publish_post_queue_arn" {
  type        = string
  description = "The SQS Arn for publish the posts."
}

variable "medium_username" {
  type        = string
  description = "Medium user name to pull the blogs from."
}

variable "lambda_shared_layer_arn" {
  type        = string
  description = "Arn of the lambda shared layer."
}

variable "lambda_node_modules_layer_arn" {
  type        = string
  description = "Arn of the lambda node modules layer."
}

