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

variable "sns_send_post_name" {
  type        = string
  description = "The SNS name for sending the posts."
  default = "Medium-Contentful-Send-Post"
}

variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "eu-west-1"
}
