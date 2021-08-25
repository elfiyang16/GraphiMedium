variable "lambda_publish_post_bucket" {
    type        = string
    description = "The bucket name for publish post lambda."
}

variable "lambda_shared_layer_arn" {
  type        = string
  description = "Arn of the lambda shared layer."
}

variable "lambda_node_modules_layer_arn" {
  type        = string
  description = "Arn of the lambda node modules layer."
}

variable "sns_send_post_topic_name" {
    type        = string
    description = "The SNS name for sending the posts."
}

variable "contentful_space_id" {
  type        = string
  description = "The contentful space id"
}

variable "contenful_management_token" {
  type        = string
  description = "The contentful mgt token"
}


