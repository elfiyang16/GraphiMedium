module "lambda_getPost" {
  source = "./lambda_getPost"
  lambda_get_post_bucket = aws_s3_bucket.lambda_get_post_bucket.id
  aws_region = var.aws_region
  sns_send_post_name= var.sns_send_post_name
  medium_username            = var.layer.medium_username
  
  lambda_node_modules_layer_arn            = module.layer.lambda_node_modules_layer_arn
  lambda_shared_layer_arn            = module.layer.lambda_shared_layer_arn
}

module "lambda_publishPost" {
  source = "./lambda_publishPost"
  lambda_publish_post_bucket = aws_s3_bucket.lambda_publish_post_bucket.id
  lambda_node_modules_layer_arn            = module.layer.lambda_node_modules_layer_arn
  lambda_shared_layer_arn            = module.layer.lambda_shared_layer_arn
  contenful_management_token = var.contenful_management_token
  contentful_space_id        = var.contentful_space_id
}

module "layer" {
  source = "./layer"
  lambda_node_modules_layer_bucket=aws_s3_bucket.lambda_node_modules_layer_bucket.id
  lambda_shared_layer_bucket=aws_s3_bucket.lambda_shared_layer_bucket.id
}