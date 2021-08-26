//TODO:
# cloudwatch event time trigger as variable

resource "random_pet" "lambda_get_post_bucket_name" {
  length = 4
  prefix = "medium-contentful-get-post"
}

resource "random_pet" "lambda_publish_post_bucket_name" {
  length = 4
  prefix = "medium-contentful-publish-post"
}

resource "random_pet" "lambda_node_modules_layer_bucket_name" {
  length = 4
  prefix = "medium-contentful-node-modules-layer"
}

resource "random_pet" "lambda_shared_layer_bucket_name" {
  length = 4
  prefix = "medium-contentful-shared-layer"
}


resource "aws_s3_bucket" "lambda_get_post_bucket" {
  bucket        = random_pet.lambda_get_post_bucket_name.id
  acl           = "private"
  force_destroy = true
}

resource "aws_s3_bucket" "lambda_publish_post_bucket" {
  bucket        = random_pet.lambda_publish_post_bucket_name.id
  acl           = "private"
  force_destroy = true
}

resource "aws_s3_bucket" "lambda_node_modules_layer_bucket" {
  bucket        = random_pet.lambda_node_modules_layer_bucket_name.id
  acl           = "private"
  force_destroy = true
}

resource "aws_s3_bucket" "lambda_shared_layer_bucket" {
  bucket        = random_pet.lambda_shared_layer_bucket_name.id
  acl           = "private"
  force_destroy = true
}


data "aws_caller_identity" "current" {}
