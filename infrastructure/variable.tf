variable "medium_username" {
  type        = string
  description = "Medium user name to pull the blogs from"
}

variable "contenful_management_token" {
  type        = string
  description = "The contentful management token"
}

variable "contentful_space_id" {
  type        = string
  description = "The contentful space id"
}

variable "sns_send_post_topic_name" {
  type        = string
  description = "The SNS name for sending the posts."
  default     = "Medium-Contentful-Send-Post"
}

variable "sqs_publish_post_queue_name" {
  type        = string
  description = "The SQS name for publish the posts."
  default     = "Medium-Contentful-Publish-Post"
}

variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "eu-west-1"
}
