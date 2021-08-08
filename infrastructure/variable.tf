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

# variable "common_tags" {
#   type        = map(any)
#   description = "Common tags applied to components"
# }

variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "eu-west-1"
}
