# variable "domain_name" {
#   type        = string
#   description = "The domain name for the blog site"
#   default     = "elfi-y"
# }

# variable "bucket_name" {
#   type        = string
#   description = "The name of the bucket without the 3w prefix"
# }

# variable "common_tags" {
#   type        = map(any)
#   description = "Common tags applied to components"
# }

variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "eu-west-1"
}